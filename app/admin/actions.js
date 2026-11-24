'use server'
import { randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '../store'
import { pages } from '../content'
import { cookieName, hasAdminSession, matches, sign } from './auth'

export async function login(form) {
  const password = process.env.MOVICTEL_ADMIN_PASSWORD || ''
  const expiry = String(Date.now() + 8 * 60 * 60 * 1000)
  const signature = sign(expiry)
  const minimumLength = process.env.NODE_ENV === 'development' ? 10 : 12
  if (password.length < minimumLength || !signature || !matches(String(form.get('password') || ''), password)) redirect('/admin/?login=failed')
  ;(await cookies()).set(cookieName, expiry + '.' + signature, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 8 * 60 * 60,
  })
  redirect('/admin/')
}

export async function logout() {
  ;(await cookies()).delete(cookieName)
  redirect('/admin/')
}

function validAsset(value) {
  return typeof value === 'string' && (/^[\w.-]+\.(jpg|jpeg|png|webp|mp4)$/i.test(value) ||
    /^\/api\/media\/[a-f0-9-]{36}$/.test(value) || value === '')
}

function validLink(link) {
  return Array.isArray(link) && link.length === 2 && link.every(value => typeof value === 'string') &&
    /^\/(?![\/\\])[a-z0-9/#-]*$/i.test(link[1])
}

export async function savePage(form) {
  if (!await hasAdminSession()) redirect('/admin/')
  const slug = String(form.get('slug'))
  if (!Object.hasOwn(pages, slug)) redirect('/admin/')
  const back = '/admin/?page=' + encodeURIComponent(slug)
  const fields = ['title', 'label', 'intro', 'image', 'imageAlt', 'seoTitle', 'seoDescription']
  const page = Object.fromEntries(fields.map(field => [field, String(form.get(field) || '').trim()]))
  try { page.sections = JSON.parse(String(form.get('sections'))) } catch { redirect(back + '&error=sections') }
  if (!page.title || !page.label || !validAsset(page.image) ||
      !Array.isArray(page.sections) || page.sections.length > 30 ||
      page.sections.some(section => !section || typeof section.heading !== 'string' || typeof section.text !== 'string' ||
        (section.image && !validAsset(section.image)) ||
        (section.background && !/^#[a-f0-9]{6}$/i.test(section.background)) ||
        (section.icon && !['building', 'messaging', 'phone', 'growth'].includes(section.icon)) ||
        (section.links && (!Array.isArray(section.links) || section.links.some(link => !validLink(link)))) ||
        (section.steps && (!Array.isArray(section.steps) || section.steps.some(step => typeof step !== 'string'))))) redirect(back + '&error=sections')
  const uploads = []
  try {
    for (const [field, target] of [['hero-file', page], ...page.sections.map((section, index) => ['section-file-' + index, section])]) {
      const file = form.get(field)
      if (!(file instanceof File) || !file.size) continue
      if (file.size > 20 * 1024 * 1024) throw new Error('File is too large')
      const bytes = Buffer.from(await file.arrayBuffer())
      const mime = mediaType(bytes)
      if (!mime) throw new Error('Unsupported media')
      const id = randomUUID()
      uploads.push({ id, mime, bytes })
      target.image = '/api/media/' + id
    }
  } catch {
    redirect(back + '&error=upload')
  }

  page.form = Boolean(pages[slug].form)
  const database = db()
  const publish = form.get('intent') === 'publish'
  database.exec('BEGIN')
  try {
    const insertAsset = database.prepare('INSERT INTO assets(id,mime,bytes) VALUES (?,?,?)')
    for (const asset of uploads) insertAsset.run(asset.id, asset.mime, asset.bytes)
    for (const target of [page, ...page.sections]) {
      target.mediaType = database.prepare('SELECT mime FROM assets WHERE id = ?').get(target.image?.split('/').at(-1) || '')?.mime ||
        (/\.mp4$/i.test(target.image || '') ? 'video/mp4' : '')
    }
    const document = JSON.stringify(page, (key, value) => key === 'editorKey' ? undefined : value)
    if (publish) {
      database.prepare('INSERT INTO revisions(slug,document) VALUES (?,?)').run(slug, document)
      database.prepare('INSERT INTO pages(slug,draft,published) VALUES (?,?,?) ON CONFLICT(slug) DO UPDATE SET draft=excluded.draft,published=excluded.published').run(slug, document, document)
    } else {
      database.prepare('INSERT INTO pages(slug,draft) VALUES (?,?) ON CONFLICT(slug) DO UPDATE SET draft=excluded.draft').run(slug, document)
    }
    database.exec('COMMIT')
  } catch (error) {
    database.exec('ROLLBACK')
    throw error
  }
  redirect(back + (publish ? '&status=published' : '&status=draft'))
}

function mediaType(bytes) {
  if (bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]))) return 'image/jpeg'
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'image/png'
  if (bytes.toString('ascii',0,4) === 'RIFF' && bytes.toString('ascii',8,12) === 'WEBP') return 'image/webp'
  if (bytes.toString('ascii',4,8) === 'ftyp') return 'video/mp4'
  if (bytes.subarray(0,4).equals(Buffer.from([26, 69, 223, 163])) && bytes.subarray(0,4096).includes(Buffer.from('webm'))) return 'video/webm'
  return ''
}
