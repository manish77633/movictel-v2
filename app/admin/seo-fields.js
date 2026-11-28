export const seoFields = {
  seoTitle: ['SEO title', 180],
  seoDescription: ['Meta description', 500],
  canonical: ['Canonical URL', 500],
  socialTitle: ['Social title', 180],
  socialDescription: ['Social description', 500],
  shareImage: ['Social image path or HTTPS URL', 500],
  shareImageAlt: ['Social image alt text', 300],
}

export function safeUrl(value) {
  if (/^\/(?![\/\\])[^\s\\]*$/.test(value)) return true
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && !url.username && !url.password && !/[\s\\]/.test(value)
  } catch {
    return false
  }
}

export function readSeo(form) {
  const seo = { title: String(form.get('title') || '').trim() }
  if (seo.title.length > 300) return null
  for (const [key, [, max]] of Object.entries(seoFields)) {
    seo[key] = String(form.get(key) || '').trim()
    if (seo[key].length > max) return null
  }
  if (seo.canonical && (!safeUrl(seo.canonical) || seo.canonical.includes('#'))) return null
  if (seo.shareImage && !(
    (/\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(seo.shareImage) && /^(?:[\w.-]+\/)*[\w.-]+$/.test(seo.shareImage) && !seo.shareImage.includes('..')) ||
    (safeUrl(seo.shareImage) && !/\.(mp4|webm)(?:$|[?#])/i.test(seo.shareImage) && !seo.shareImage.endsWith('#video'))
  )) return null
  return { ...seo, noIndex: form.has('noIndex'), noFollow: form.has('noFollow') }
}
