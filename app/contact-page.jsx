import { ArrowDown, ArrowUpRight, MapPin, Phone } from 'lucide-react'
import { submitEnquiry } from './enquiry'
import { EnquiryButton } from './enquiry-button'
import { serviceMenu } from './service-menu'
import { hasContentStorage } from './store'

const directions = 'https://maps.app.goo.gl/Uj1wDx8LmmchE3Cg6'
const officeMap = 'https://maps.google.com/maps?q=' + encodeURIComponent('Movictel, Office 21, Tagore Nagar, 200 Ft Bypass, Jaipur') + '&z=15&output=embed'
const whatsapp = 'https://wa.me/919001955232'
const choices = serviceMenu.flatMap(group => group.items)

export function EnquiryForm({ contact = false, service, sent, invalid }) {
  if (!hasContentStorage()) {
    const name = choices.find(([, id]) => id === service)?.[0]
    const message = name ? '?text=' + encodeURIComponent('Hi Movictel, I’d like to discuss ' + name + '.') : ''
    return <div className={contact ? 'contact-form' : 'interior-form editorial-enquiry'}>
      <h2>Tell us about your project.</h2>
      <p>Send your project details on WhatsApp or call us directly.</p>
      <div className="interior-links">
        <a className="button" href={whatsapp + message}>Message on WhatsApp <ArrowUpRight size={17}/></a>
        <a href="tel:+919001955232">Call +91 90019 55232</a>
      </div>
    </div>
  }
  return <form className={'interior-form ' + (contact ? 'contact-form' : 'editorial-enquiry')} action={submitEnquiry}>
    <input type="hidden" name="returnTo" value={contact ? 'contact' : 'book-a-consultation'}/>
    {!contact && <h2>Tell us about your project.</h2>}
    {sent && <p className="enquiry-status" role="status">Thanks. Your enquiry has been submitted.</p>}
    {invalid && <p className="enquiry-status enquiry-status--error" role="alert">Check your contact information and project details and try again.</p>}
    <label>Name<input name="name" autoComplete="name" maxLength={120} required/></label>
    <label>Email<input name="email" type="email" autoComplete="email" maxLength={254} required/></label>
    <label><span>Phone number <small className="enquiry-optional">(optional)</small></span>
      <input name="phone" type="tel" autoComplete="tel" maxLength={30} inputMode="tel"/>
    </label>
    <label>Service
      <select name="service" defaultValue={choices.find(([, id]) => id === service)?.[0] || ''} required>
        <option value="" disabled>Select a service</option>
        {serviceMenu.map(group => <optgroup key={group.id} label={group.title}>{group.items.map(([label]) => <option key={label}>{label}</option>)}</optgroup>)}
        <option>Other</option>
      </select>
    </label>
    <label className="enquiry-wide">Project details<textarea name="message" rows={5} maxLength={2000} required/></label>
    <EnquiryButton/>
  </form>
}

export function ContactPage({ page, service, sent, invalid, draft }) {
  const sections = page.sections.filter(section => section.visible !== false)
  const office = sections.find(section => section.id === 'office' || section.heading === 'Jaipur office')
  const careers = sections.find(section => section.id === 'careers' || section.heading === 'Careers at Movictel')
  const additional = sections.filter(section => section !== office && section !== careers)
  const src = page.image && (page.image.startsWith('/') ? page.image : '/media/' + page.image)

  return <main className="contact-page" id="home">
    <section className="contact-hero" aria-labelledby="contact-title">
      {src && (page.mediaType?.startsWith('video/') || /\.mp4$/i.test(src) ?
        <video className="contact-hero-media" src={src} autoPlay muted loop playsInline aria-hidden="true"/> :
        <img className="contact-hero-media" src={src} alt={page.imageAlt || ''} fetchPriority="high"/>)}
      <div className="wrap contact-hero-inner">
        <h1 id="contact-title">{page.title}</h1>
        <p>{page.intro}</p>
        <a href="#contact-enquiry">Tell us about your project <ArrowDown size={17} aria-hidden="true"/></a>
      </div>
    </section>
    <div className="contact-paper">
      <section id="contact-enquiry" className="wrap contact-enquiry-layout" aria-labelledby="contact-form-heading">
        <div className="contact-enquiry-copy">
          <h2 id="contact-form-heading">Tell us about your project.</h2>
          <p>Planning a property launch, a campaign or a better way to handle customer enquiries? Share a few details and we’ll get back to you.</p>
          <a href={whatsapp}>Prefer WhatsApp? <ArrowUpRight size={15} aria-hidden="true"/></a>
          {draft && <p role="status">Draft preview</p>}
        </div>
        <EnquiryForm contact service={service} sent={sent} invalid={invalid}/>
      </section>
      {office && <section className="wrap contact-office" aria-labelledby="contact-office-heading">
        <img className="contact-office-photo" src={office.image ? (office.image.startsWith('/') ? office.image : '/media/' + office.image) : '/media/contact-jaipur.webp'}
          alt={office.imageAlt || 'Illustrative view of Jaipur’s Pink City'} loading="lazy"/>
        <div className="contact-office-info">
          <h2 id="contact-office-heading">{office.heading}</h2>
          <p>{office.text}</p>
          {office.points?.map(point => <p key={point}>{point}</p>)}
          <div className="contact-office-links">
            <a className="button" href={directions}><MapPin size={17} aria-hidden="true"/> Get directions <ArrowUpRight size={15} aria-hidden="true"/></a>
            <a className="button contact-call-button" href="tel:+919001955232"><Phone size={16} aria-hidden="true"/> Call +91 90019 55232</a>
          </div>
          <div className="contact-office-map">
            <iframe src={officeMap} title="Map of Movictel’s Jaipur office" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/>
          </div>
        </div>
      </section>}
      {careers && <section className="wrap contact-careers" aria-labelledby="contact-careers-heading">
        <div><h2 id="contact-careers-heading">{careers.heading}</h2><p>{careers.text}</p></div>
        {careers.points?.length > 0 && <ul>{careers.points.map(point => <li key={point}>{point}</li>)}</ul>}
        <a className="button" href={whatsapp + '?text=' + encodeURIComponent('Hi Movictel, I’d like to share my portfolio for career opportunities.')}>Share your portfolio <ArrowUpRight size={17}/></a>
      </section>}
      {additional.map((section, index) => <section className="wrap contact-extra" key={index}><h2>{section.heading}</h2><p>{section.text}</p></section>)}
    </div>
  </main>
}
