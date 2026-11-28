import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pages } from './content'
import { homeDefaults } from './page-metadata'
import { redirectedPages } from './seo'
import { chromeDefaults, completeChrome } from './chrome-content'
import { enquiryServices, serviceMenu } from './service-menu'

export function hasContentStorage() {
  return process.env.VERCEL !== '1' || Boolean(process.env.MOVICTEL_DB_PATH)
}

let database

export function db() {
  if (database) return database
  const path = resolve(/* turbopackIgnore: true */ process.env.MOVICTEL_DB_PATH || 'data/site.sqlite')
  mkdirSync(dirname(path), { recursive: true })
  database = new DatabaseSync(path)
  database.exec(`
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, document TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS pages (slug TEXT PRIMARY KEY, draft TEXT, published TEXT);
    CREATE TABLE IF NOT EXISTS revisions (id INTEGER PRIMARY KEY, slug TEXT NOT NULL, document TEXT NOT NULL, created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE INDEX IF NOT EXISTS revisions_slug_id ON revisions(slug, id DESC);
    CREATE TABLE IF NOT EXISTS leads (id INTEGER PRIMARY KEY, name TEXT, email TEXT, phone TEXT, service TEXT, message TEXT, created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS media_details (id TEXT PRIMARY KEY, name TEXT NOT NULL, alt TEXT NOT NULL DEFAULT '', created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS assets (id TEXT PRIMARY KEY, mime TEXT NOT NULL, bytes BLOB NOT NULL);
  `)
  database.exec('BEGIN IMMEDIATE')
  try {
    const columns = database.prepare('PRAGMA table_info(leads)').all()
    if (!columns.some(column => column.name === 'phone')) database.exec('ALTER TABLE leads ADD COLUMN phone TEXT')
    database.exec('COMMIT')
  } catch (error) {
    database.exec('ROLLBACK')
    database.close()
    database = undefined
    throw error
  }
  return database
}

export function basePage(slug) {
  return slug === '' ? homeDefaults : Object.hasOwn(pages, slug) ? pages[slug] : null
}

export function listPageSlugs() {
  const custom = hasContentStorage() ? db().prepare('SELECT slug FROM pages ORDER BY slug').all().map(row => row.slug) : []
  return [...new Set(['', ...Object.keys(pages), ...custom])].filter(slug =>
    slug !== 'book-a-consultation' && !Object.hasOwn(redirectedPages, slug))
}

export function readPage(slug, draft = false) {
  const base = basePage(slug)
  if (!hasContentStorage()) return base
  const row = db().prepare('SELECT draft, published FROM pages WHERE slug = ?').get(slug)
  const content = draft ? row?.draft || row?.published : row?.published
  if (content === 'null') return null
  if (content) return { ...base, ...JSON.parse(content) }
  return base
}

export function readSetting(key) {
  if (!hasContentStorage()) return null
  const row = db().prepare('SELECT document FROM settings WHERE key = ?').get(key)
  return row ? JSON.parse(row.document) : null
}

export function publishedCustomServices() {
  if (!hasContentStorage()) return []
  return db().prepare(`SELECT slug, published FROM pages
    WHERE slug GLOB 'services/*' AND json_extract(published, '$.serviceCategory') IS NOT NULL
    ORDER BY slug`).all().flatMap(({ slug, published }) => {
    const page = JSON.parse(published)
    if (!serviceMenu.some(group => group.id === page.serviceCategory)) return []
    return [{ id: slug.slice('services/'.length), href: '/' + slug + '/', category: page.serviceCategory,
      heading: page.title, text: page.intro, image: page.image, imageAlt: page.imageAlt || '' }]
  })
}

export function publicEnquiryServices(services = publishedCustomServices()) {
  return [...enquiryServices, ...services.map(service => [service.heading, service.id])]
}

export function readPublicHeader(services = publishedCustomServices()) {
  const header = completeChrome('header', readSetting('header'))
  const groups = header.serviceGroups.map(group => ({ ...group, links: [...group.links] }))
  const existingLinks = new Set(groups.flatMap(group => group.links.map(link => link.href.replace(/\/$/, ''))))
  for (const service of services) {
    if (existingLinks.has(service.href.slice(0, -1))) continue
    const defaults = chromeDefaults.header.serviceGroups[serviceMenu.findIndex(group => group.id === service.category)]
    const defaultLinks = new Set(defaults.links.map(link => link.href.replace(/\/$/, '')))
    let group = groups.find(item => item.heading === defaults.heading) ||
      groups.find(item => item.links.some(link => defaultLinks.has(link.href.replace(/\/$/, ''))))
    if (!group) {
      group = { heading: defaults.heading, links: [] }
      groups.push(group)
    }
    group.links.push({ label: service.heading, text: service.text, href: service.href })
  }
  return { ...header, serviceGroups: groups }
}
