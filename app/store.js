import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pages } from './content'
import { homeDefaults } from './page-metadata'
import { redirectedPages } from './seo'

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
