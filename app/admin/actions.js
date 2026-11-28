'use server'
import { randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { basePage, db, hasContentStorage, listPageSlugs, readPage } from '../store'
import { collectionLabels, sectionTypes } from '../section-types'
import { chromeDefaults } from '../chrome-content'
import { linkIcons } from '../link-icons'
import { pageLayout, pageSectionCatalog } from '../section-layout'
import { buttonPositions, mediaId, validateContent, validateLayout, validMedia } from './layout-fields'
import { pagePath } from '../seo'
import { revalidatePath } from 'next/cache'
import { readSeo, safeUrl } from './seo-fields'
import { cookieName, hasAdminSession, matches, sign } from './auth'
import { enquiryServices, serviceMenu } from '../service-menu'

export async function login(form) {
  if (!hasContentStorage()) redirect('/admin/')
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

function validLink(link) {
  return Array.isArray(link) && link.length === 2 && link.every(value => typeof value === 'string') &&
    (safeUrl(link[1]) || /^#[a-z0-9-]+$/i.test(link[1]))
}

export async function savePage(_previous, form) {
  if (!hasContentStorage() || !await hasAdminSession()) redirect('/admin/')
  const slug = String(form.get('slug'))
  if (!listPageSlugs().includes(slug) || !readPage(slug, true)) redirect('/admin/')
  const sectionId = form.get('section')
  if (sectionId) return publishPageSection(slug, sectionId, form.get('layout'))
  const publish = form.get('intent') === 'publish'
  const fields = { title: 300, label: 200, intro: 10000, image: 1500, imageAlt: 300 }
  const existing = readPage(slug, true)
  const page = { ...existing, ...Object.fromEntries(Object.keys(fields).map(field => [field, String(form.get(field) || '').trim()])) }
  try {
    const catalog = pageSectionCatalog(slug, existing)
    page.sections = JSON.parse(String(form.get('sections')))
    if (catalog.length && form.has('layout')) page.layout = validateLayout(JSON.parse(String(form.get('layout'))), catalog)
    syncHeroFields(page)
  } catch {
    return { error: 'Check the section settings, media URLs and button destinations, then save again.' }
  }
  if (!page.title || (slug !== '' && !page.label) || !validMedia(page.image) ||
      Object.entries(fields).some(([field, limit]) => page[field].length > limit)) {
    return { error: 'A page heading is required. Check section fields, media paths and links.' }
  }
  if (!Array.isArray(page.sections) || page.sections.length > 30 ||
      page.sections.some(section => !section || typeof section.heading !== 'string' || typeof section.text !== 'string' ||
        (section.type && !Object.hasOwn(sectionTypes, section.type)) ||
        (section.items && (!Object.hasOwn(collectionLabels, section.type) || !Array.isArray(section.items) || section.items.length > 30 ||
          section.items.some(item => !Array.isArray(item) || item.length !== 2 || item.some(value => typeof value !== 'string' || value.length > 5000) ||
            !item[0].trim() || (section.type === 'gallery' && (!validMedia(item[0]) || /\.(mp4|webm)$/i.test(item[0])))))) ||
        (section.id && !/^[a-z0-9-]+$/i.test(section.id)) ||
        (section.points && (!Array.isArray(section.points) || section.points.some(point => typeof point !== 'string'))) ||
        (section.image && !validMedia(section.image)) ||
        (section.backdrop && !validMedia(section.backdrop)) ||
        (section.buttonPosition && !Object.hasOwn(buttonPositions, section.buttonPosition)) ||
        (section.background && !/^#[a-f0-9]{6}$/i.test(section.background)) ||
        (section.icon && !['building', 'messaging', 'phone', 'growth'].includes(section.icon)) ||
        (section.links && (!Array.isArray(section.links) || section.links.some(link => !validLink(link)))) ||
        (section.steps && (!Array.isArray(section.steps) || section.steps.some(step => typeof step !== 'string'))))) {
    return { error: 'A page heading is required. Check section fields, media paths and links.' }
  }
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
      uploads.push({ id, mime, bytes, name: file.name.slice(0, 240), alt: String(target.imageAlt || '').slice(0, 300) })
      target.image = '/api/media/' + id
    }
  } catch {
    return { error: 'Choose a supported photo or video under 20 MB.' }
  }

  page.form = Boolean(existing.form)
  const database = db()
  database.exec('BEGIN')
  try {
    const insertAsset = database.prepare('INSERT INTO assets(id,mime,bytes) VALUES (?,?,?)')
    for (const asset of uploads) {
      insertAsset.run(asset.id, asset.mime, asset.bytes)
      database.prepare('INSERT INTO media_details(id,name,alt) VALUES (?,?,?)').run(asset.id, asset.name, asset.alt)
    }
    applyPageMediaTypes(database, [page, ...page.sections])
    storePageDocuments(database, slug, page, publish ? page : null)
    database.exec('COMMIT')
  } catch (error) {
    database.exec('ROLLBACK')
    throw error
  }
  if (publish) refreshPublic(slug)
  return { saved: publish ? 'published' : 'draft', savedAt: Date.now() }
}

function publishPageSection(slug, sectionId, layout) {
  const database = db()
  database.exec('BEGIN IMMEDIATE')
  let committed = false
  try {
    const draft = readPage(slug, true)
    const live = readPage(slug)
    if (!live) return { error: 'Publish the page before publishing an individual section.' }
    let section
    try {
      const submitted = JSON.parse(String(layout))
      const catalog = pageSectionCatalog(slug, draft)
      ;[section] = validateLayout(submitted.filter(item => item?.id === sectionId), catalog.filter(item => item.id === sectionId))
      if (!section) throw new Error('Unknown section')
    } catch {
      return { error: 'Check this section’s settings, media URLs and button destinations, then save again.' }
    }
    const updatedDraft = replacePageSection(slug, draft, section)
    const updatedLive = replacePageSection(slug, live, section)
    if (sectionId === 'hero') {
      if (!updatedDraft.title || updatedDraft.title.length > 300 || (slug !== '' && !updatedDraft.label) ||
          updatedDraft.label.length > 200 || updatedDraft.intro.length > 10000 || updatedDraft.imageAlt.length > 300) {
        return { error: 'Check the page heading and hero fields, then save again.' }
      }
      applyPageMediaTypes(database, [updatedDraft, updatedLive])
    }
    storePageDocuments(database, slug, updatedDraft, updatedLive)
    database.exec('COMMIT')
    committed = true
  } finally {
    if (!committed) database.exec('ROLLBACK')
  }
  refreshPublic(slug)
  return { saved: 'published', sectionId, savedAt: Date.now() }
}

function applyPageMediaTypes(database, targets) {
  const selectMime = database.prepare('SELECT mime FROM assets WHERE id = ?')
  for (const target of targets) {
    target.mediaType = selectMime.get(mediaId(target.image || ''))?.mime ||
      (/\.mp4$/i.test(target.image || '') ? 'video/mp4' : /\.webm$/i.test(target.image || '') ? 'video/webm' : '')
  }
}

function storePageDocuments(database, slug, draft, published) {
  const serialize = page => JSON.stringify(page, (key, value) => key === 'editorKey' ? undefined : value)
  const draftDocument = serialize(draft)
  if (!published) {
    database.prepare('INSERT INTO pages(slug,draft) VALUES (?,?) ON CONFLICT(slug) DO UPDATE SET draft=excluded.draft').run(slug, draftDocument)
    return
  }
  const publishedDocument = published === draft ? draftDocument : serialize(published)
  database.prepare('INSERT INTO revisions(slug,document) VALUES (?,?)').run(slug, publishedDocument)
  database.prepare('INSERT INTO pages(slug,draft,published) VALUES (?,?,?) ON CONFLICT(slug) DO UPDATE SET draft=excluded.draft,published=excluded.published')
    .run(slug, draftDocument, publishedDocument)
}

function replacePageSection(slug, page, section) {
  const updated = { ...page, form: Boolean(page.form), layout: pageLayout(slug, page).map(item => item.id === section.id ? section : item) }
  if (section.id === 'hero') syncHeroFields(updated)
  return updated
}

function syncHeroFields(page) {
  const content = page.layout?.find(section => section.id === 'hero')?.content
  if (content) {
    Object.assign(page, { title: content.heading.trim(), label: content.label.trim(), intro: content.text.trim(), image: content.media, imageAlt: content.imageAlt })
  }
}

function mediaType(bytes) {
  if (bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255]))) return 'image/jpeg'
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'image/png'
  if (bytes.toString('ascii',0,4) === 'RIFF' && bytes.toString('ascii',8,12) === 'WEBP') return 'image/webp'
  if (bytes.toString('ascii',4,8) === 'ftyp') return 'video/mp4'
  if (bytes.subarray(0,4).equals(Buffer.from([26, 69, 223, 163])) && bytes.subarray(0,4096).includes(Buffer.from('webm'))) return 'video/webm'
  return ''
}

function refreshPublic(slug) {
  revalidatePath(pagePath(slug))
  revalidatePath('/sitemap.xml')
  if (slug.startsWith('services/')) {
    revalidatePath('/')
    revalidatePath('/[...slug]', 'page')
  }
}

export async function saveSeo(_previous, form) {
  if (!hasContentStorage() || !await hasAdminSession()) redirect('/admin/')
  const slug = String(form.get('slug'))
  if (!listPageSlugs().includes(slug)) redirect('/admin/?view=seo')
  const seo = readSeo(form)
  if (!seo || !seo.title) return { error: 'Check the heading and metadata. Use HTTPS or a site-relative URL for the canonical link and image.' }
  if (seo.shareImage?.startsWith('/api/media/')) {
    const asset = db().prepare('SELECT mime FROM assets WHERE id=?').get(seo.shareImage.split('/').at(-1))
    if (!asset?.mime.startsWith('image/')) return { error: 'Choose an image from the media library.' }
  }
  const publish = form.get('intent') === 'publish'
  const database = db()
  database.exec('BEGIN IMMEDIATE')
  try {
    const draft = readPage(slug, true)
    const live = readPage(slug)
    if (!draft || (publish && !live)) {
      database.exec('ROLLBACK')
      return { error: 'Open an existing page. Publish it from Pages before publishing its SEO.' }
    }
    const draftDocument = JSON.stringify(withSeo(draft, seo))
    if (publish) {
      const document = JSON.stringify(withSeo(live, seo))
      database.prepare('INSERT INTO revisions(slug,document) VALUES (?,?)').run(slug, document)
      database.prepare('INSERT INTO pages(slug,draft,published) VALUES (?,?,?) ON CONFLICT(slug) DO UPDATE SET draft=excluded.draft,published=excluded.published').run(slug, draftDocument, document)
    } else {
      database.prepare('INSERT INTO pages(slug,draft) VALUES (?,?) ON CONFLICT(slug) DO UPDATE SET draft=excluded.draft').run(slug, draftDocument)
    }
    database.exec('COMMIT')
  } catch (error) {
    database.exec('ROLLBACK')
    throw error
  }
  if (publish) refreshPublic(slug)
  return { saved: true, published: publish }
}

function withSeo(page, seo) {
  const updated = { ...page, ...seo }
  if (page.layout) {
    updated.layout = page.layout.map(section => section.id === 'hero'
      ? { ...section, content: { ...section.content, heading: seo.title } } : section)
  }
  return updated
}

export async function createService(form) {
  if (!hasContentStorage() || !await hasAdminSession()) redirect('/admin/')
  const title = String(form.get('title') || '').trim()
  const id = String(form.get('slug') || '').trim().toLowerCase()
  const category = serviceMenu.find(group => group.id === form.get('category'))
  const slug = 'services/' + id
  if (!title || title.length > 150 || !category || id.length > 90 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) ||
      basePage(slug) || enquiryServices.some(([, value]) => value === id)) {
    redirect('/admin/?view=services&error=service')
  }
  const page = {
    title, serviceName: title, serviceCategory: category.id, label: category.title,
    intro: 'Explore how Movictel can help with ' + title + '.',
    image: 'live-team.jpg', imageAlt: '', sections: [],
  }
  const result = db().prepare("INSERT OR IGNORE INTO pages(slug,draft,published) VALUES (?,?,'null')").run(slug, JSON.stringify(page))
  if (!result.changes) redirect('/admin/?view=services&error=service')
  redirect('/admin/?page=' + encodeURIComponent(slug) + '&status=draft')
}

export async function createPage(form) {
  if (!hasContentStorage() || !await hasAdminSession()) redirect('/admin/')
  const slug = String(form.get('slug') || '').trim().toLowerCase()
  const title = String(form.get('title') || '').trim()
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 90 || !title || title.length > 150 ||
    ['admin', 'api', 'media', 'book-a-consultation', 'portfolio-single-page', 'industries'].includes(slug) || basePage(slug)) {
    redirect('/admin/?view=pages&error=slug')
  }
  const result = db().prepare("INSERT OR IGNORE INTO pages(slug,draft,published) VALUES (?,?,'null')").run(slug,
    JSON.stringify({ title, label: 'Page', intro: '', image: '', sections: [] }))
  if (!result.changes) redirect('/admin/?view=pages&error=slug')
  redirect('/admin/?page=' + encodeURIComponent(slug) + '&status=draft')
}

export async function changePageStatus(form) {
  if (!hasContentStorage() || !await hasAdminSession()) redirect('/admin/')
  const slug = String(form.get('slug'))
  if (!listPageSlugs().includes(slug) || !readPage(slug, true)) redirect('/admin/')
  const draft = JSON.stringify(readPage(slug, true))
  const intent = form.get('intent')
  if (intent === 'delete' && !basePage(slug)) {
    const database = db()
    database.exec('BEGIN IMMEDIATE')
    try {
      database.prepare('DELETE FROM revisions WHERE slug=?').run(slug)
      database.prepare('DELETE FROM pages WHERE slug=?').run(slug)
      database.exec('COMMIT')
    } catch (error) {
      database.exec('ROLLBACK')
      throw error
    }
    refreshPublic(slug)
    redirect('/admin/?view=' + (slug.startsWith('services/') ? 'services' : 'pages') + '&status=deleted')
  }
  if (intent !== 'unpublish') redirect('/admin/?page=' + encodeURIComponent(slug))
  db().prepare("INSERT INTO pages(slug,draft,published) VALUES (?,?,'null') ON CONFLICT(slug) DO UPDATE SET draft=excluded.draft,published='null'").run(slug, draft)
  refreshPublic(slug)
  redirect('/admin/?page=' + encodeURIComponent(slug) + '&status=unpublished')
}

export async function saveSetting(_previous, form) {
  if (!hasContentStorage() || !await hasAdminSession()) redirect('/admin/')
  const key = form.get('setting')
  if (key !== 'header' && key !== 'footer') redirect('/admin/')
  let value
  const link = entry => Array.isArray(entry) && entry.length === 2 && typeof entry[0] === 'string' && entry[0].trim() && typeof entry[1] === 'string' && (safeUrl(entry[1]) || /^#[a-z0-9-]+$/i.test(entry[1]))
  const links = entries => Array.isArray(entries) && entries.length <= 30 && entries.every(link)
  const footerLink = entry => Array.isArray(entry) && entry.length >= 2 && entry.length <= 3 &&
    (link(entry.slice(0, 2)) || (typeof entry[0] === 'string' && entry[0].trim() && typeof entry[1] === 'string' &&
      /^mailto:[a-z0-9.!#$&'*+\/=^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(entry[1]))) &&
    (entry.length === 2 || (typeof entry[2] === 'string' && Object.hasOwn(linkIcons, entry[2])))
  const footerLinks = entries => Array.isArray(entries) && entries.length <= 30 && entries.every(footerLink)
  try {
    value = JSON.parse(String(form.get('document')))
    if (!value || !validMedia(value.logo) || /\.(mp4|webm)$/i.test(value.logo) ||
      typeof value.alt !== 'string' || value.alt.length > 200) throw new Error('Invalid logo')
    if (key === 'header' && (!links(value.links) || !link(value.cta) || typeof value.showCta !== 'boolean' || typeof value.showServices !== 'boolean')) throw new Error('Invalid header')
    if (key === 'footer' && (!footerLinks(value.socials) || typeof value.copyright !== 'string' ||
      !Array.isArray(value.columns) || value.columns.length > 6 || value.columns.some(column => !column ||
        typeof column.title !== 'string' || !column.title.trim() || !footerLinks(column.links)))) throw new Error('Invalid footer')
    const validText = field => typeof value[field] === 'string' && value[field].length <= 3000
    if (key === 'header') {
      if (!validText('homepageLabel') || !validText('servicesLabel')) throw new Error('Invalid navigation labels')
      const { servicesButton, serviceGroups } = chromeDefaults.header
      Object.assign(value, validateContent({ servicesButton, serviceGroups }, value))
    }
    if (key === 'footer') {
      if (!validText('brandText') || !validText('backToTop') || typeof value.showClosing !== 'boolean') throw new Error('Invalid footer fields')
      value.contact = validateContent(chromeDefaults.footer.contact, value.contact)
      value.closing = validateContent(chromeDefaults.footer.closing, value.closing)
    }
  } catch {
    return { error: 'Check the labels, link destinations and logo, then save again.' }
  }
  if (value.logo.startsWith('/api/media/')) {
    const asset = db().prepare('SELECT mime FROM assets WHERE id = ?').get(value.logo.split('/').at(-1))
    if (!asset?.mime.startsWith('image/')) return { error: 'Choose an image for the logo.' }
  }
  db().prepare('INSERT INTO settings(key,document) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET document=excluded.document').run(key, JSON.stringify(value))
  revalidatePath('/')
  revalidatePath('/[...slug]', 'page')
  return { saved: true }
}

export async function manageMedia(form) {
  if (!hasContentStorage() || !await hasAdminSession()) redirect('/admin/')
  const back = '/admin/?view=media'
  const intent = form.get('intent')
  const database = db()
  const alt = String(form.get('alt') || '').trim().slice(0, 300)
  if (intent === 'upload') {
    const result = await uploadAssets(form)
    if (result.error) redirect(back + '&error=upload')
  } else {
    const id = String(form.get('id'))
    if (!/^[a-f0-9-]{36}$/.test(id) || !database.prepare('SELECT id FROM assets WHERE id=?').get(id)) redirect(back)
    if (intent === 'delete') {
      database.exec('BEGIN IMMEDIATE')
      const path = '/api/media/' + id
      const used = database.prepare(`SELECT 1 FROM pages WHERE instr(draft, ?) OR instr(published, ?)
        UNION ALL SELECT 1 FROM settings WHERE instr(document, ?) LIMIT 1`).get(path, path, path)
      if (used) {
        database.exec('ROLLBACK')
        redirect(back + '&error=in-use')
      }
      try {
        database.prepare('DELETE FROM media_details WHERE id=?').run(id)
        database.prepare('DELETE FROM assets WHERE id=?').run(id)
        database.exec('COMMIT')
      } catch (error) {
        database.exec('ROLLBACK')
        throw error
      }
      revalidatePath(path)
    } else if (intent === 'alt') {
      database.prepare('INSERT INTO media_details(id,name,alt) VALUES (?,?,?) ON CONFLICT(id) DO UPDATE SET alt=excluded.alt').run(id, id, alt)
    }
  }
  redirect(back + '&status=saved')
}

export async function saveSiteSettings(form) {
  if (!hasContentStorage() || !await hasAdminSession()) redirect('/admin/')
  const googleVerification = String(form.get('googleVerification') || '').trim()
  if (!/^[A-Za-z0-9_-]{0,200}$/.test(googleVerification)) redirect('/admin/?view=settings&error=fields')
  db().prepare("INSERT INTO settings(key,document) VALUES ('site',?) ON CONFLICT(key) DO UPDATE SET document=excluded.document")
    .run(JSON.stringify({ googleVerification }))
  revalidatePath('/')
  redirect('/admin/?view=settings&status=saved')
}

export async function uploadAssets(form) {
  if (!hasContentStorage() || !await hasAdminSession()) return { error: 'Sign in to upload media.' }
  const files = form.getAll('file').filter(file => file instanceof File && file.size)
  if (!files.length || files.length > 30 || files.some(file => file.size > 20 * 1024 * 1024)) {
    return { error: 'Choose up to 30 files, each under 20 MB. The combined size must fit the 24 MB request limit.' }
  }

  const alt = String(form.get('alt') || '').trim().slice(0, 300)
  const uploads = []
  for (const file of files) {
    const bytes = Buffer.from(await file.arrayBuffer())
    const mime = mediaType(bytes)
    if (!mime || (form.has('imageOnly') && !mime.startsWith('image/'))) return { error: 'Choose a supported photo or video.' }
    uploads.push({ id: randomUUID(), name: file.name.slice(0, 240), bytes, mime })
  }

  const database = db()
  database.exec('BEGIN IMMEDIATE')
  try {
    const insertAsset = database.prepare('INSERT INTO assets(id,mime,bytes) VALUES (?,?,?)')
    const insertDetails = database.prepare('INSERT INTO media_details(id,name,alt) VALUES (?,?,?)')
    for (const { id, name, bytes, mime } of uploads) {
      insertAsset.run(id, mime, bytes)
      insertDetails.run(id, name, alt)
    }
    database.exec('COMMIT')
  } catch (error) {
    database.exec('ROLLBACK')
    throw error
  }

  return { items: uploads.map(({ id, name, mime }) => ({
    name, alt, video: mime.startsWith('video/'), value: '/api/media/' + id + (mime.startsWith('video/') ? '#video' : ''),
  })) }
}
