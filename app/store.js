import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pages } from './content'

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
    CREATE TABLE IF NOT EXISTS pages (slug TEXT PRIMARY KEY, draft TEXT, published TEXT);
    CREATE TABLE IF NOT EXISTS revisions (id INTEGER PRIMARY KEY, slug TEXT NOT NULL, document TEXT NOT NULL, created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS leads (id INTEGER PRIMARY KEY, name TEXT, email TEXT, phone TEXT, service TEXT, message TEXT, created TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
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

export function readPage(slug, draft = false) {
  if (!Object.hasOwn(pages, slug)) return null
  if (!hasContentStorage()) return pages[slug]
  const row = db().prepare('SELECT draft, published FROM pages WHERE slug = ?').get(slug)
  const content = draft ? row?.draft || row?.published : row?.published
  return content ? { ...pages[slug], ...JSON.parse(content) } : pages[slug]
}
