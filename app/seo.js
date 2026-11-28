export const siteOrigin = 'https://movictel.com'

export const redirectedPages = {
  industries: '/services/',
  'portfolio-single-page': '/portfolio/residential-campaign/',
}

export const isVercelPreview = process.env.VERCEL_ENV === 'preview'

export const unindexed = { index: false, follow: false }

export const seoTitles = {
  services: 'Digital Marketing, Communications & Web Services',
  'services/real-estate-marketing': 'Real Estate Marketing for Developers in Jaipur',
  'services/social-media-marketing-jaipur': 'Social Media Marketing in Jaipur',
  'services/seo': 'Local SEO Services for Businesses in Jaipur',
  'services/ppc-advertising': 'PPC Advertising for Google Ads & Meta Ads',
  'services/branding': 'Brand Strategy & Visual Identity Services',
  'services/content-writing': 'Content Writing for Websites & Campaigns',
  'services/whatsapp-business-api': 'WhatsApp Business API Setup & Workflows',
  'services/ivr': 'IVR Phone Menus & Call Routing Services',
  'services/rcs': 'RCS Business Messaging Services',
  'services/bulk-sms': 'Bulk SMS for Business Reminders & Alerts',
  'services/voice-sms': 'Voice SMS & Recorded Call Services',
  'services/web-development': 'Custom Business Website Development',
  'services/mobile-app-development': 'Mobile App Design & Development',
  'services/graphic-design': 'Graphic Design for Campaigns & Sales Materials',
  'services/landing-page-design': 'Landing Page Design for Paid Campaigns',
  'services/seo-branding': 'Combined SEO & Brand Positioning Services',
  about: 'About Our Jaipur Digital Marketing Team',
  contact: 'Contact Our Jaipur Team',
  portfolio: 'Marketing Portfolio & Campaign Examples',
  blog: 'Digital Marketing & Business Messaging Insights',
}

export function pagePath(slug = '') {
  return slug ? '/' + slug + '/' : '/'
}
