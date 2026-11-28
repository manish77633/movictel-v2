import { readPage, listPageSlugs } from './store'
import { isVercelPreview, pagePath, siteOrigin } from './seo'

export const dynamic = 'force-dynamic'

export default function sitemap() {
  if (isVercelPreview) return []
  return listPageSlugs().flatMap(slug => {
    const page = readPage(slug)
    const url = siteOrigin + pagePath(slug)
    return page && !page.noIndex && (!page.canonical || new URL(page.canonical, siteOrigin).href === url) ? [{ url }] : []
  })
}
