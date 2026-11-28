import { Camera, Code2, Globe2, Link2, Mail, MessageCircle, Rss, Send } from 'lucide-react'

const symbols = {
  instagram: Camera,
  whatsapp: MessageCircle,
  telegram: Send,
  github: Code2,
  email: Mail,
  website: Globe2,
  link: Link2,
  rss: Rss,
}

export function LinkIcon({ icon, size = 17 }) {
  if (icon === 'none') return null
  const Icon = symbols[icon]
  if (Icon) return <Icon width={size} height={size} data-link-icon={icon} aria-hidden="true"/>
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-link-icon={icon} aria-hidden="true">
    {icon === 'facebook' && <path d="M14 22V12h3l.6-4H14V6c0-1.1.4-2 2-2h2V1h-3c-3 0-5 2-5 5v2H7v4h3v10" fill="currentColor" stroke="none"/>}
    {icon === 'linkedin' && <path d="M3 9h4v12H3zm2-6a2 2 0 1 0 0 4 2 2 0 1 0 0-4zm5 6h4v1.6c.8-1.3 2-1.9 3.4-1.9 2.9 0 4.6 1.7 4.6 5V21h-4v-6.5c0-1.5-.6-2.3-1.9-2.3-1.4 0-2.1 1-2.1 2.3V21h-4z" fill="currentColor" stroke="none"/>}
    {icon === 'youtube' && <><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none"/></>}
    {icon === 'x' && <><path d="M3 3h4l14 18h-4z"/><path d="m21 3-7.5 8.1M3 21l7.5-8.1"/></>}
  </svg>
}
