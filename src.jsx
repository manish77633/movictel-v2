import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'framer-motion'
import {
  ArrowDown, ArrowDownRight, ArrowUp, ArrowUpRight, CalendarDays, Check, ChevronDown, CodeXml,
  MapPin, Menu, MessageCircle, MessageSquareText, Minus, Phone, Plus, Quote, TrendingUp, X,
} from 'lucide-react'
import './style.css'
import './contact.css'

const site = 'https://movictel.com'
const book = site + '/book-a-consultation/'
const whatsapp = 'https://wa.me/919001955232'
const media = name => '/media/' + name


const services = [
  { id: 'marketing', label: 'Digital marketing', icon: TrendingUp, description: 'Get discovered and give people a reason to enquire.', items: [
    ['Social media marketing', 'Put your offer in front of the right audience.', 'social', 'hero.jpg'],
    ['Branding services', 'Build a recognizable identity across channels.', 'brand'],
    ['Website & local SEO', 'Help customers find you in search and on maps.', null, 'seo.jpg'],
    ['Content writing', 'Explain what you offer in clear, useful copy.', null, 'design.jpg'],
  ]},
  { id: 'promote', label: 'Cloud communications', icon: MessageCircle, description: 'Answer enquiries and follow up where customers already are.', items: [
    ['WhatsApp Business API', 'Answer enquiries and automate customer updates.', 'whatsapp'],
    ['Bulk SMS', 'Send timely reminders and alerts to opted-in customers.', 'sms'],
    ['RCS messaging', 'Send rich messages with images and tappable actions.', 'rcs'],
    ['Voice SMS', 'Share a recorded update through a phone call.', 'voice'],
  ]},
  { id: 'development', label: 'Web & app development', icon: CodeXml, description: 'Give customers a clear place to browse, book or get in touch.', items: [
    ['Website development', 'Build responsive sites around what customers need to do.', 'website'],
    ['Mobile app development', 'Design useful apps for customers on the move.', null, 'wa.jpg'],
    ['Graphic design', 'Create campaign graphics that carry your brand across channels.', 'graphic'],
    ['Landing page design', 'Build focused pages around one offer or action.', 'landing'],
  ]},
]
const industries = [
  { id: 'real-estate', label: 'Real estate', image: 'property.webp', alt: 'Movictel real estate marketing campaign artwork featuring a residential development', title: 'From property search to site visit.', description: 'Lead generation, project shoots and landing pages for property campaigns.' },
  { id: 'education', label: 'Education', image: 'school.webp', alt: 'Movictel school marketing campaign artwork featuring a school campus', title: 'From school discovery to admissions.', description: 'Brand films, search and social campaigns that help parents discover your school.' },
]

const clients = [
  ['Jaigyan Realty', 'jaigyan.png'], ['Shri Krishna Group', 'krishna.webp'],
  ['Sheetla Properties', 'sheetla.webp'], ['Suryansh Realty', 'suryansh.webp'],
  ['Vinnora Realty', 'vinnora.webp'], ['Royal Homes', 'royal.webp'],
]

const questions = [
  ['What is bulk SMS marketing and how effective is it?', 'Bulk SMS sends alerts, reminders and offers to customers who have opted in. Results depend on the audience, timing and message relevance.'],
  ['What does a digital marketing agency do?', 'An agency plans and runs campaigns across search, social and other channels to help your business reach customers and generate enquiries.'],
  ['How does SEO help improve website traffic and rankings?', 'SEO helps search engines understand your pages and match them to relevant searches.'],
  ['Which digital marketing services should a small business start with?', 'A clear website and local SEO are useful starting points. Paid campaigns can help when you have a specific goal and budget.'],
  ['How does local SEO help my business get more customers?', 'It helps nearby customers find your business and see details such as your hours, location and contact information.'],
  ['Can social media marketing generate leads and sales?', 'Targeted campaigns can send interested people to an enquiry form, online shop or messaging channel.'],
  ['What is the difference between Google Ads and Meta Ads?', 'Google Search Ads reach customers as they search. Meta Ads reach selected audiences across platforms such as Instagram and Facebook.'],
  ['Can I automate messages for customer follow-ups?', 'WhatsApp Business API and SMS can support opt-in follow-ups, reminders and updates.'],
  ['Do you offer custom website design or templates?', 'Movictel offers website development and landing page design. Contact the team to discuss the right approach for your project.'],
]

const testimonials = [
  ['Movictel’s bulk SMS services completely transformed our customer communication process.', 'Rohit Sharma', 'E-commerce Marketing Head'],
  ['Movictel’s WhatsApp automation services significantly improved how we connect with our customers.', 'Pooja Verma', 'CEO, Healthcare Startup'],
  ['Movictel proved to be the best web development agency in Jaipur for our growing business needs.', 'Ashish Sen', 'Founder, Automobile Company'],
]

const navigation = [['Home', '#home'], ['Industries', '#industries'], ['Blog', site + '/blog/'], ['About', site + '/about/'], ['Contact', '#contact']]
const socials = [['Instagram', 'https://www.instagram.com/movictel', 'IG'], ['LinkedIn', 'https://www.linkedin.com/company/movictel/', 'in'], ['Facebook', 'https://www.facebook.com/Movictel/', 'f']]

function Header() {
  const [open, setOpen] = useState(false)
  return <header className="site-header">
    <div className="wrap nav">
      <a href="#home" className="brand" aria-label="Movictel home"><img src={media('logo-color.png')} alt="Movictel"/></a>
      <button type="button" className="menu-button" aria-expanded={open} aria-controls="navigation" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      <nav className={open ? 'is-open' : ''} id="navigation" aria-label="Main navigation" onClick={event => { if (event.target.closest('a')) setOpen(false) }}>
        <a href={navigation[0][1]}>{navigation[0][0]}</a>
        <details className="nav-services">
          <summary>Services <ChevronDown size={14}/></summary>
          <div>{services.map(({id, label}) => <a key={id} href={'#' + id} onClick={event => { event.currentTarget.closest('details').removeAttribute('open') }}>{label}</a>)}</div>
        </details>
        {navigation.slice(1).map(([label, href]) => <a key={label} href={href}>{label}</a>)}
        <a className="button mobile-book" href={book}>Book a consultation <ArrowUpRight size={16}/></a>
      </nav>
      <a className="button nav-book" href={book}>Book a consultation <ArrowUpRight size={16}/></a>
    </div>
  </header>
}

function Hero() {
  return <section className="hero" id="home" aria-labelledby="hero-title">
    <img className="hero-image" src={media('estate.jpg')} alt="" fetchPriority="high"/>
    <div className="wrap hero-layout">
      <div className="hero-copy">
        <p className="location"><MapPin size={16}/> Jaipur, Rajasthan</p>
        <h1 id="hero-title">Get found.<br/>Start conversations.</h1>
        <p className="hero-intro">Movictel brings digital marketing, business messaging and web development together to turn interest into enquiries.</p>
        <div className="hero-actions">
          <a className="button" href={book}>Book a consultation <ArrowUpRight size={17}/></a>
          <a className="button secondary" href="#services">Explore services <ArrowDown size={17}/></a>
        </div>
      </div>
      <div className="hero-index" aria-label="Explore Movictel services">
        {services.map(({id, label}) => <a href={'#' + id} key={id}>{label}<ArrowDownRight size={19}/></a>)}
      </div>
    </div>
  </section>
}


function RevealHeading({ children, id }) {
  const reduce = useReducedMotion()
  return <h2 className="reveal-heading" id={id}>
    <motion.span initial={reduce ? false : { y: '.72em', opacity: 0 }} whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: .2 }} transition={{ duration: reduce ? 0 : .62, ease: [.22, 1, .36, 1] }}>
      {children}
    </motion.span>
  </h2>
}

const serviceGraphics = {
  brand: <div className="brand-study"><span>Brand guide</span><b>Aa</b><div className="swatches"><i/><i/><i/></div></div>,
  whatsapp: <div className="chat-study"><span><MessageCircle size={14}/> WhatsApp</span><p>Can I book a visit?</p><p>Yes. What time works?</p></div>,
  sms: <div className="sms-study"><MessageSquareText size={23}/><div><b>Appointment reminder</b><span>Tomorrow at 10:30 am</span></div><Check size={17}/></div>,
  rcs: <div className="rcs-study"><div className="rcs-thumbnail"><CalendarDays size={27}/></div><div><b>Book a site visit</b><span>Choose a time <ArrowUpRight size={12}/></span></div></div>,
  voice: <div className="voice-study"><span><Phone size={14}/> Recorded update</span><div className="waveform">{[8, 14, 12, 24, 18, 30, 20, 13, 23, 16, 12, 7].map((height, i) => <i key={i} style={{height}}/>)}</div></div>,
  website: <div className="browser-study"><div><i/><i/><i/></div><span/><div className="browser-content"><b/><b/></div></div>,
  graphic: <div className="poster-study"><span>Design<br/>in motion</span><i/><i/></div>,
  landing: <div className="landing-study"><div><b>Find your<br/>next home.</b><span>Book a visit</span></div><div className="landing-window"><ArrowUpRight size={25}/></div></div>,
}

function ServiceArtwork({ photo, visual }) {
  return <div className={visual ? 'service-art service-art--' + visual : 'service-art'} aria-hidden="true">
    {photo && <img src={media(photo)} alt="" loading="lazy"/>}
    {visual === 'social' && <div className="social-frame"><span>Open house</span><small>Sunday · 11 am</small></div>}
    {serviceGraphics[visual]}
  </div>
}

function Services() {
  return <section className="section service-section" id="services" aria-labelledby="services-heading">
    <div className="wrap">
      <div className="section-heading"><RevealHeading id="services-heading">Find the right service.</RevealHeading><p>Choose a specific service or bring marketing, messaging and development together.</p></div>
      {services.map(({ id, label, description, icon: Icon, items }) => <section key={id} id={id} className="service-group" aria-labelledby={id + '-heading'}>
        <div className="service-group-heading"><span className="category-icon"><Icon size={20}/></span><h3 id={id + '-heading'}>{label}</h3><p>{description}</p></div>
        <ul className="service-grid">{items.map(([name, detail, visual, photo]) => <li className="service-card" key={name}>

          <a className="service-card-link" href={whatsapp + '?text=' + encodeURIComponent('Hi Movictel, I would like to know more about ' + name + '.')}>
            <ServiceArtwork photo={photo} visual={visual}/>
            <div className="service-card-copy"><h4>{name}</h4><p>{detail}</p><span className="service-card-action">Ask on WhatsApp <ArrowUpRight size={14}/></span></div>
          </a>

        </li>)}</ul>
      </section>)}
      <a className="text-link service-directory" href={site + '/services/'}>Browse Movictel’s service pages <ArrowUpRight size={17}/></a>
    </div>
  </section>
}


function Industries() {
  return <section className="section industries" id="industries">
    <div className="wrap">
      <div className="section-heading"><RevealHeading>Built for your industry.</RevealHeading><p>Two examples of how Movictel brings marketing, content and technology together.</p></div>
      <div className="industry-grid">{industries.map(({id,label,image,title,description}) => <article className="industry-card" key={id} id={id}>
        <a href={media(image)} className="campaign-image" aria-label={'View ' + label.toLowerCase() + ' campaign artwork'}><img className="campaign-cover" src={media(image)} alt="" loading="lazy"/><span aria-hidden="true"><ArrowUpRight size={22}/></span></a>
        <div className="industry-copy"><p className="category">{label}</p><h3>{title}</h3><p>{description}</p><a className="text-link" href={media(image)}>View campaign <ArrowUpRight size={17}/></a></div>
      </article>)}</div>
    </div>
  </section>
}


function Clients() {
  return <section className="section clients" aria-labelledby="clients-heading">
    <div className="wrap">
      <div className="client-heading"><RevealHeading id="clients-heading">Businesses we work with</RevealHeading></div>
      <ul className="client-logos" aria-label="Client logos" tabIndex={0}>{clients.map(([name, image]) =>
        <li key={name}><img src={media(image)} alt={name} loading="lazy"/></li>)}</ul>
    </div>
  </section>
}

function Testimonials() {
  const order = [testimonials[1], testimonials[0], testimonials[2]]
  return <section className="section testimonials" aria-labelledby="testimonials-heading">
    <div className="wrap">
      <div className="section-heading"><RevealHeading id="testimonials-heading">What our clients say</RevealHeading><p>On working with Movictel across messaging and web development.</p></div>
      <div className="quote-bento">{order.map(([copy, name, role], i) => <figure key={name} className={i === 0 ? 'quote-feature' : undefined}>
        <Quote className="quote-icon" size={i === 0 ? 30 : 20} aria-hidden="true"/>
        <blockquote>“{copy}”</blockquote>
        <figcaption><strong>{name}</strong><span>{role}</span></figcaption>
      </figure>)}</div>
    </div>
  </section>
}

function FAQ() {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  return <section className="section faq-section"><div className="wrap faq-layout">
    
    <div className="faq-aside">
      <div><RevealHeading>Good questions.</RevealHeading><p>What to know before choosing your next marketing or messaging service.</p></div>
      <figure className="faq-photo"><img src={media('web.jpg')} alt="A laptop and monitor on a development workspace" loading="lazy"/><figcaption><span>Have a question about your project?</span><a className="button" href={whatsapp}>Ask on WhatsApp <ArrowUpRight size={16}/></a></figcaption></figure>
    </div>

    <div className="accordion">{questions.map(([question, answer], i) => <div key={question} className={active === i ? 'is-open' : undefined}>
      <button aria-expanded={active === i} aria-controls={'answer-' + i} type="button" onClick={() => setActive(active === i ? -1 : i)}>{question}{active === i ? <Minus size={19}/> : <Plus size={19}/>}</button>
      <div id={'answer-' + i}><AnimatePresence initial={false}>{active === i && <motion.div className="answer" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:reduce ? 0 : .22}}><p>{answer}</p></motion.div>}</AnimatePresence></div>
    </div>)}</div>
    </div>
  </section>
}


const footerServices = [
  ['Social Media Marketing', '#marketing'],
  ['SEO & Local SEO', '#marketing'],
  ['WhatsApp Business API', '#promote'],
  ['Bulk SMS & RCS', '#promote'],
  ['Website & App Development', '#development'],
  ['Graphic Design & Landing Pages', '#development'],
]

function Footer() {
  return <>
    <section className="closing" id="contact" aria-labelledby="closing-title">
      <div className="wrap closing-layout">
        <div><RevealHeading id="closing-title">Ready to grow<br className="desktop-break"/> your business?</RevealHeading>
          <p>Tell us about your business, goals and current campaigns. We’ll help you choose where to start, from SEO and paid ads to business messaging.</p></div>
        <a href={book} className="button">Get started <ArrowUpRight size={20}/></a>
      </div>
    </section>
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand"><a href="#home" className="brand"><img src={media('logo.webp')} alt="Movictel"/></a>
            <p>Movictel is a digital marketing agency in Jaipur offering internet marketing and cloud communication services.</p>
            <div className="socials">{socials.map(([name, href, mark]) => <a key={name} href={href} aria-label={name}>{mark}</a>)}</div>
          </div>
          <div className="footer-links footer-nav"><h3>Navigate</h3><a href="#home">Home</a><a href="#services">Services</a>{navigation.slice(2).map(([label, href]) => <a key={label} href={href}>{label}</a>)}</div>
          <div className="footer-links footer-services"><h3>Services</h3>{footerServices.map(([label,href]) => <a key={label} href={href}>{label}</a>)}</div>
          <div className="footer-links footer-contact"><h3>Visit &amp; contact</h3>
            <address><MapPin size={19}/> Office 21, Tagore Nagar, Satya Colony, near Gopi Tower, C. M. Gora Hospital, 200 Ft Bypass, Ajmer Road, Jaipur, Rajasthan 302021</address>
            <a href="tel:+919001955232"><Phone size={17}/> +91 90019 55232</a>
            <a href={whatsapp}><MessageCircle size={17}/> WhatsApp us</a>
          </div>
        </div>
        <div className="copyright"><span>© {new Date().getFullYear()} Movictel. All rights reserved.</span><a href="#home">Back to top <ArrowUp size={17}/></a></div>
      </div>
      <div className="footer-wordmark" aria-hidden="true">movictel</div>
    </footer>
  </>
}

function App() {
  return <MotionConfig reducedMotion="user">
    <Header/>
    <main><Hero/><Services/><Industries/><Clients/><Testimonials/><FAQ/></main>
    <Footer/>
  </MotionConfig>
}

createRoot(document.getElementById('root')).render(<App/>)







