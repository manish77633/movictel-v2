import { isVercelPreview, pagePath, seoTitles, unindexed } from './seo'
import { isVideo, mediaUrl } from './media-source'

export const homeDefaults = {
  title: 'Movictel, a digital marketing, cloud communications and web development company in India',
  label: 'IVR · Bulk SMS · WhatsApp API · Digital',
  intro: 'Grow your business with professional IVR, digital marketing, messaging and software services from our team in Jaipur.',
  image: 'estate-hero.mp4',
  imageAlt: '',
  seoTitle: 'Digital Marketing & Cloud Communications in Jaipur | Movictel',
  seoDescription: 'Movictel helps Jaipur businesses plan campaigns, build websites and manage customer enquiries through WhatsApp, SMS and phone.',
  sections: [],
}

export function buildMetadata(slug, page, preview, defaultImage) {
  const title = page.seoTitle || seoTitles[slug] || page.title
  const description = page.seoDescription || page.intro
  const url = page.canonical || pagePath(slug)
  const image = page.shareImage || defaultImage || '/media/estate-hero.jpg'
  const images = [{ url: image.startsWith('/') || image.startsWith('https://') ? image : '/media/' + image, alt: page.shareImageAlt || undefined }]
  const socialTitle = page.socialTitle || title
  const socialDescription = page.socialDescription || description
  return {
    title: slug ? title : { absolute: title },
    description,
    alternates: { canonical: url },
    robots: isVercelPreview || preview ? unindexed : { index: !page.noIndex, follow: !page.noFollow },
    openGraph: { type: slug.startsWith('blog/') ? 'article' : 'website', siteName: 'Movictel', title: socialTitle, description: socialDescription, url, images },
    twitter: { card: 'summary_large_image', title: socialTitle, description: socialDescription, images },
  }
}

export function metadataImage(page, hero) {
  const image = hero?.media ?? page.image
  return isVideo(image, page.mediaType) ? mediaUrl(hero?.poster) : mediaUrl(image)
}
