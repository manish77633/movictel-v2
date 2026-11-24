const selections = {
  'social-media-marketing-jaipur': ['service-gallery/hero-social.webp', 'social', 'service-gallery/phone-1.webp', 'marketing', 1],
  seo: ['seo.jpg', 'seo', 'service-seo.webp', 'marketing', 4],
  'ppc-advertising': ['service-gallery/hero-ppc.webp', 'ppc', 'service-gallery/phone-2.webp', 'marketing', 7],
  branding: ['contact-studio.webp', 'branding', 'service-branding.webp', 'brand', 1],
  'content-writing': ['design.jpg', 'writing', 'service-writing.webp', 'brand', 4],
  'whatsapp-business-api': ['sms.jpg', 'whatsapp', 'service-whatsapp.webp', 'brand', 7],
  ivr: ['service-gallery/hero-ivr.webp', 'ivr', 'service-gallery/phone-3.webp', 'messaging', 1],
  rcs: ['service-gallery/hero-rcs.webp', 'rcs', 'service-rcs.webp', 'messaging', 4],
  'bulk-sms': ['service-gallery/hero-sms.webp', 'sms', 'service-sms.webp', 'messaging', 7],
  'voice-sms': ['service-gallery/hero-voice.webp', 'voice', 'service-voice.webp', 'digital', 1],
  'web-development': ['web.jpg', 'web', 'service-website.webp', 'digital', 4],
  'mobile-app-development': ['service-gallery/hero-app.webp', 'app', 'service-app.webp', 'digital', 7],
  'graphic-design': ['journal-planning-desk.webp', 'graphic', 'service-graphic.webp', 'design', 1],
  'landing-page-design': ['service-gallery/hero-landing.webp', 'landing', 'service-landing.webp', 'design', 4],
  'seo-branding': ['service-gallery/hero-seo-brand.webp', 'seo-brand', 'service-gallery/phone-4.webp', 'design', 7],
}

export const servicePhotos = Object.fromEntries(
  Object.entries(selections).map(([slug, [hero, gallery, leadCutout, cutoutSet, firstCutout]]) => {
    const photos = Array.from({ length: 6 }, (_, index) => 'service-gallery/' + gallery + '-' + (index + 1) + '.webp')
    const deliverableCutouts = Array.from({ length: 3 }, (_, index) =>
      'service-gallery/phone-' + cutoutSet + '-' + (firstCutout + index) + '.webp'
    )
    return [slug, {
      hero,
      cutouts: [leadCutout, ...deliverableCutouts],
      examplePhotos: photos.slice(0, 3),
      workflowPhotos: photos.slice(3),
    }]
  })
)

export const serviceImages = {
  'real-estate-marketing': 'estate.jpg',
  ...Object.fromEntries(Object.entries(servicePhotos).map(([slug, { hero }]) => [slug, hero])),
}
