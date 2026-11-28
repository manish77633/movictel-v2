import { ArrowUpRight, Building2, MessageCircle, Phone, TrendingUp } from 'lucide-react'
import { FlowPreview, Reveal } from './site-chrome'
import { SectionButton, SectionFrame, SectionMedia } from './section-frame'

const icons = { building: Building2, messaging: MessageCircle, phone: Phone, growth: TrendingUp }

export function ManagedSections({ sections, includeAnchors = true }) {
  const visible = sections.filter(section => section.visible !== false)
  if (!visible.length) return null
  return <div className="wrap interior-sections">{visible.map((section, index) =>
    <SectionFrame key={section.id || index} section={{ ...section, visible: true }}>
      <Reveal className="interior-section">
        <div id={includeAnchors ? section.id : undefined} className="editorial-section-copy">
          <SectionHeading section={section}/><SectionText section={section}/>
        </div>
        {section.image && <figure className="editorial-section-media"><SectionMedia value={section.image} mime={section.mediaType} alt={section.imageAlt}/></figure>}
      </Reveal>
    </SectionFrame>
  )}</div>
}

export function SectionHeading({ section, tag: Tag = 'h2' }) {
  const Icon = Object.hasOwn(icons, section.icon) ? icons[section.icon] : null
  return <>{Icon && <Icon className="interior-section-icon" aria-hidden="true" size={28}/>}<Tag>{section.heading}</Tag></>
}

export function SectionText({ section }) {
  return <>
    {section.text && <p>{section.text}</p>}
    <SectionCollection section={section}/>
    {!!section.points?.length && <ul>{section.points.map((point, i) => <li key={i}>{point}</li>)}</ul>}
    {!!section.steps?.length && <FlowPreview steps={section.steps}/>}
    {!!section.links?.length && <div className="interior-links cms-buttons" data-position={section.buttonPosition || 'start'}>
      {section.links.map(([label, href], i) => <SectionButton button={{ label, href }} className="" key={i}><ArrowUpRight size={14}/></SectionButton>)}
    </div>}
  </>
}

export function SectionCollection({ section }) {
  if (!section.items?.length) return null
  return <div className="managed-collection">{section.items.map(([first, second], index) => {
    if (section.type === 'faq') return <details key={index}><summary>{first}</summary><p>{second}</p></details>
    if (section.type === 'gallery') return <SectionMedia key={index} value={first} alt={second}/>
    if (section.type === 'testimonials') return <figure key={index}><blockquote>{second}</blockquote><figcaption>{first}</figcaption></figure>
    return <article key={index}><h3>{first}</h3><p>{second}</p></article>
  })}</div>
}
