export const linkIcons = {
  auto: 'Automatic',
  none: 'Label only',
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  x: 'X',
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  github: 'GitHub',
  email: 'Email',
  website: 'Website',
  link: 'Link',
  rss: 'RSS',
}

const hosts = {
  'facebook.com': 'facebook',
  'fb.com': 'facebook',
  'instagram.com': 'instagram',
  'linkedin.com': 'linkedin',
  'youtube.com': 'youtube',
  'youtu.be': 'youtube',
  'twitter.com': 'x',
  'x.com': 'x',
  'whatsapp.com': 'whatsapp',
  'wa.me': 'whatsapp',
  'telegram.org': 'telegram',
  't.me': 'telegram',
  'github.com': 'github',
}

export function resolveLinkIcon(icon, href) {
  if (icon !== 'auto') return Object.hasOwn(linkIcons, icon) ? icon : 'link'
  try {
    const host = new URL(href).hostname
    return Object.entries(hosts).find(([domain]) => host === domain || host.endsWith('.' + domain))?.[1] || 'link'
  } catch {
    return 'link'
  }
}
