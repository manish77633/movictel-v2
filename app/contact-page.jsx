import { ArrowDown, ArrowUpRight, MapPin, Phone } from 'lucide-react'
import { hasContentStorage } from './store'
import { editablePageSections } from './section-layout'
import { LayoutSections, SectionButton, SectionMedia } from './section-frame'
import { ManagedSections } from './managed-sections'
import { ContactProcess } from './contact-process'
import { ProjectEnquiry } from './project-enquiry'

export function ContactPage({ page, layout, service, demo, draft }) {
  const officeVisible = layout.find(section => section.id === 'office')?.visible
  const render = {
    hero: content => <section className="contact-hero" aria-labelledby="contact-title">
      <SectionMedia className="contact-hero-media" value={content.media} alt={content.imageAlt} priority background/>
      <div className="wrap contact-hero-inner">
        <h1 id="contact-title">{content.heading}</h1><p>{content.text}</p>
        <div className="contact-actions cms-buttons" data-position={content.buttonPosition}>
          <SectionButton button={demo ? content.demoButton : content.primaryButton}><ArrowDown size={17} aria-hidden="true"/></SectionButton>
          {officeVisible && <SectionButton button={content.officeButton} className="contact-hero-directions"><ArrowDown size={17} aria-hidden="true"/></SectionButton>}
        </div>
      </div>
    </section>,
    enquiry: content => <div className="contact-paper"><ProjectEnquiry contact service={service} demo={demo} draft={draft} content={content} viaWhatsApp={!hasContentStorage()}/></div>,
    process: content => <div className="contact-paper"><ContactProcess content={content}/></div>,
    office: content => <div className="contact-paper"><Office content={content}/></div>,
    careers: content => <div className="contact-paper"><section className="wrap contact-careers" aria-labelledby="contact-careers-heading">
      <div><h2 id="contact-careers-heading">{content.heading}</h2><p>{content.text}</p></div>
      {content.points.length > 0 && <ul>{content.points.map((point, index) => <li key={index}>{point}</li>)}</ul>}
      <SectionButton button={content.button}><ArrowUpRight size={17} aria-hidden="true"/></SectionButton>
    </section></div>,
  }
  return <main className="contact-page" id="home">
    <LayoutSections layout={layout} hiddenHeading={page.title} render={(id, content) => render[id](content)}/>
    <div className="contact-paper"><ManagedSections sections={editablePageSections('contact', page)}/></div>
  </main>
}

function Office({ content }) {
  const map = 'https://maps.google.com/maps?q=' + encodeURIComponent(content.mapAddress) + '&z=15&output=embed'
  return <section id="contact-office" className="wrap contact-office" aria-labelledby="contact-office-heading">
    <SectionMedia className="contact-office-photo" value={content.image} alt={content.imageAlt}/>
    <div className="contact-office-info">
      <h2 id="contact-office-heading">{content.heading}</h2><p>{content.text}</p>
      {content.points.map((point, index) => <p key={index}>{point}</p>)}
      <div className="contact-office-links">
        <SectionButton button={content.directionsButton}><MapPin size={17} aria-hidden="true"/></SectionButton>
        {content.phone && <a className="button contact-call-button" href={'tel:' + content.phone.replace(/[^+0-9]/g, '')}><Phone size={16} aria-hidden="true"/> {content.callLabel}</a>}
      </div>
      {content.showMap && content.mapAddress && <div className="contact-office-map">
        <iframe src={map} title={'Map of ' + content.mapAddress} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/>
      </div>}
    </div>
  </section>
}
