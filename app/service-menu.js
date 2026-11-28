export const serviceMenu = [
  { id: 'promote', title: 'Cloud communications', items: [
    ['WhatsApp Business API', 'whatsapp-business-api', 'Automated replies and team handoff'],
    ['IVR', 'ivr', 'Call menus and routing'],
    ['RCS messaging', 'rcs', 'Branded messages with actions'],
    ['Bulk SMS', 'bulk-sms', 'Alerts and reminders'],
    ['Voice SMS', 'voice-sms', 'Recorded calls and updates'],
  ] },
  { id: 'marketing', title: 'Digital marketing', items: [
    ['Real estate marketing', 'real-estate-marketing', 'Project launches and site visit enquiries'],
    ['Social media marketing', 'social-media-marketing-jaipur', 'Content, reels and paid social'],
    ['SEO', 'seo', 'Local search and site improvements'],
    ['PPC advertising', 'ppc-advertising', 'Google and Meta campaigns'],
    ['Branding', 'branding', 'Positioning and visual identity'],
    ['Content writing', 'content-writing', 'Website and campaign copy'],
  ] },
  { id: 'development', title: 'Web and design', items: [
    ['Website development', 'web-development', 'Responsive business websites'],
    ['Mobile app development', 'mobile-app-development', 'Apps built around customer tasks'],
    ['Graphic design', 'graphic-design', 'Campaign and brand assets'],
    ['Landing page design', 'landing-page-design', 'Focused pages for paid campaigns'],
  ] },
]

export const enquiryServices = [
  ...serviceMenu.flatMap(group => group.items.map(([name, id]) => [name, id])),
  ['SEO and branding', 'seo-branding'],
  ['Other', 'other'],
]
