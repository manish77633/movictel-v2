import { isVercelPreview, siteOrigin } from './seo'

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: isVercelPreview ? undefined : siteOrigin + '/sitemap.xml',
  }
}
