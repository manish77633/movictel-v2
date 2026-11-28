import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { LayoutSections, SectionButton, SectionMedia } from './section-frame'
import { ManagedSections } from './managed-sections'

export function ServiceDirectory({ page, layout, enquiry, published }) {
  const groups = layout.filter(section => section.content.cards && section.visible)
  const render = {
    hero: content => <section className="service-showcase-hero">
      <div className="service-showcase-hero-image"><SectionMedia value={content.media} alt={content.imageAlt} priority background/></div>
      <div className="wrap service-showcase-hero-copy">
        <p className="service-showcase-eyebrow">{content.label}</p>
        <h1>{content.heading}</h1><p>{content.text}</p>
        <div className="cms-buttons" data-position={content.buttonPosition}><SectionButton button={content.button}><ArrowUpRight size={17}/></SectionButton></div>
      </div>
      <nav className="service-showcase-nav wrap" aria-label="Service categories">{groups.map(group => <a key={group.id} href={'#' + group.id}>{group.content.label}<ArrowUpRight size={15}/></a>)}</nav>
    </section>,
    intro: content => <div className="wrap service-showcase-body"><section className="service-showcase-intro"><h2>{content.heading}</h2><p>{content.text}</p></section></div>,
    enquiry: () => enquiry,
  }
  function group(id, content) {
    return <div className="wrap service-showcase-body service-directory-body"><section className="service-directory-group" id={id}>
      <div className="service-directory-heading"><p>{content.label}</p><h2>{content.heading}</h2></div>
      <div className="service-directory-grid">{content.cards.map((card, index) => {
        const link = card.href && (!Object.hasOwn(published, card.href) || published[card.href])
        const image = card.image
        const copy = <><SectionMedia value={image} alt={card.imageAlt}/><div><span>0{index + 1}</span><h3>{card.heading}{link && <ArrowUpRight size={18}/>}</h3><p>{card.text}</p></div></>
        return link
          ? <Link className="service-directory-card" href={card.href} key={index}>{copy}</Link>
          : <article className="service-directory-card" key={index}>{copy}</article>
      })}</div>
    </section></div>
  }
  return <main className="service-showcase" id="home">
    <LayoutSections layout={layout} hiddenHeading={page.title} render={(id, content) => render[id] ? render[id](content) : group(id, content)}/>
    <ManagedSections sections={page.sections} includeAnchors={false}/>
  </main>
}
