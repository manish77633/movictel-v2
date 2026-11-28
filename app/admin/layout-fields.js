import { sectionAction } from '../section-layout'
import { safeUrl } from './seo-fields'
import { isVideo } from '../media-source'

const filePath = /^(?:[\w.-]+\/)*[\w.-]+\.(?:jpg|jpeg|png|webp|mp4|webm|avif|gif|svg)(?:\?v=\d+)?$/i
const assetPath = /^\/api\/media\/[a-f0-9-]{36}(?:#video)?$/
export const buttonPositions = { start: 'Left', center: 'Center', end: 'Right', stacked: 'Stacked' }

export function validMedia(value) {
  return typeof value === 'string' && value.length <= 1500 && (value === '' ||
    assetPath.test(value) || (filePath.test(value.replace(/^\/media\//, '')) && !value.includes('..')) ||
    (value.startsWith('https://') && safeUrl(value)))
}

export function mediaId(value) {
  return assetPath.test(value) ? value.slice('/api/media/'.length).split('#')[0] : ''
}

export function fieldType(key, value) {
  if (Array.isArray(value)) return 'list'
  if (typeof value === 'object') return 'group'
  if (typeof value === 'boolean') return 'checkbox'
  if (['image', 'media', 'video', 'poster', 'backdrop'].includes(key)) return 'media'
  if (key === 'href' || key.endsWith('Href')) return 'link'
  if (key === 'buttonPosition') return 'position'
  if (['text', 'answer', 'description', 'quote', 'intro', 'formText', 'demoText'].includes(key)) return 'textarea'
  return 'text'
}

export function defaultItem(value) {
  if (Array.isArray(value)) return []
  if (typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, field]) => [key, defaultItem(field)]))
  return typeof value === 'boolean' ? false : ''
}

function validatedValue(model, value, key) {
  switch (fieldType(key, model)) {
    case 'list':
      if (!Array.isArray(value) || value.length > 40) throw new Error('Invalid list')
      return value.map(item => validatedValue(model[0], item, key))
    case 'group':
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid fields')
      return Object.fromEntries(Object.entries(model).map(([name, seed]) => [name, validatedValue(seed, value[name], name)]))
    case 'checkbox':
      if (typeof value !== 'boolean') throw new Error('Invalid toggle')
      return value
    case 'media':
      if (!validMedia(value) || (key === 'video' && value && !isVideo(value))) throw new Error('Invalid media')
      return value
    case 'link':
      if (typeof value !== 'string' || value.length > 1500 || (value && !safeUrl(value) && !/^#[a-z0-9-]+$/i.test(value))) throw new Error('Invalid link')
      return value
    case 'position':
      if (!Object.hasOwn(buttonPositions, value)) throw new Error('Invalid button position')
      return value
    default:
      if (typeof value !== 'string' || value.length > 12000) throw new Error('Invalid text')
      return value
  }
}

export function validateContent(model, content) {
  return validatedValue(model, content, '')
}

export function validateLayout(layout, catalog) {
  if (!Array.isArray(layout) || layout.length !== catalog.length || new Set(layout.map(row => row?.id)).size !== catalog.length) {
    throw new Error('Invalid section order')
  }
  const models = new Map(catalog.map(item => [item.id, item.content]))
  return layout.map(({ id, visible, background, backdrop, content, action }) => {
    if (!models.has(id) || typeof visible !== 'boolean' || (background !== '' && !/^#[a-f0-9]{6}$/i.test(background)) || !validMedia(backdrop)) {
      throw new Error('Invalid section settings')
    }
    return { id, visible, background, backdrop, action: validateContent(sectionAction, action), content: validatedValue(models.get(id), content, '') }
  })
}
