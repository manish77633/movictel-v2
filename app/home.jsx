'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { serviceMenu } from './service-menu'
import { ClientLogoStrip } from './client-logo-strip'
import { AnimatePresence, motion, MotionConfig, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowDown, ArrowDownRight, ArrowUp, ArrowUpRight, ChevronDown, CodeXml,
  Lightbulb, MapPin, Menu, Pause, Play, Search, MessageCircle, Minus, Phone, Plus, Quote, TrendingUp, X,
} from 'lucide-react'
import { StrategyIcon } from './strategy-icon.jsx'
import { useSmoothWheel } from './smooth-wheel.js'

const site = ''
const book = site + '/book-a-consultation/'
const whatsapp = 'https://wa.me/919001955232'
const media = name => '/media/' + name


const services = [
  { id: 'marketing', label: 'Digital marketing', icon: TrendingUp, description: 'Get discovered and give people a reason to enquire.', items: [
    ['Social media marketing', 'Put your offer in front of the right audience.', 'service-social.webp'],
    ['Branding services', 'Build a recognizable identity across channels.', 'service-branding.webp'],
    ['Website & local SEO', 'Help customers find you in search and on maps.', 'service-seo.webp'],
    ['Content writing', 'Explain what you offer in clear, useful copy.', 'service-writing.webp'],
  ]},
  { id: 'promote', label: 'Cloud communications', icon: MessageCircle, description: 'Answer enquiries and follow up where customers already are.', items: [
    ['WhatsApp Business API', 'Answer enquiries and automate customer updates.', 'service-whatsapp.webp'],
    ['Bulk SMS', 'Send timely reminders and alerts to opted-in customers.', 'service-sms.webp'],
    ['RCS messaging', 'Send rich messages with images and tappable actions.', 'service-rcs.webp'],
    ['Voice SMS', 'Share a recorded update through a phone call.', 'service-voice.webp'],
  ]},
  { id: 'development', label: 'Web & app development', icon: CodeXml, description: 'Give customers a clear place to browse, book or get in touch.', items: [
    ['Website development', 'Build responsive sites around what customers need to do.', 'service-website.webp'],
    ['Mobile app development', 'Design useful apps for customers on the move.', 'service-app.webp'],
    ['Graphic design', 'Create campaign graphics that carry your brand across channels.', 'service-graphic.webp'],
    ['Landing page design', 'Build focused pages around one offer or action.', 'service-landing.webp'],
  ]},
]
const industries = [
  {
    id: 'real-estate', label: 'Real estate', image: 'industry-property.webp',
    alt: 'Illustrative Jaipur apartment development with sandstone façades and a landscaped entrance',
    title: 'Help buyers get from search to site visit.',
    description: 'Project films, paid campaigns and landing pages that give buyers a clear next step.',
    href: '/services/real-estate-marketing/', action: 'Explore real estate marketing',
  },
  {
    id: 'education', label: 'Education', image: 'industry-education.webp',
    alt: 'Illustrative school campus with students crossing a shaded courtyard',
    title: 'Give families a first look at your school.',
    description: 'Campus films, local search and admissions campaigns that help parents decide where to enquire.',
    href: '/contact/', action: 'Discuss school admissions',
  },
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

const navigation = [['Home', '/'], ['Blog', site + '/blog/'], ['About', site + '/about/'], ['Contact', '/contact/']]
const socials = [['Instagram', 'https://www.instagram.com/movictel', 'IG'], ['LinkedIn', 'https://www.linkedin.com/company/movictel/', 'in'], ['Facebook', 'https://www.facebook.com/Movictel/', 'f']]

function HeaderLink({ children, ...props }) {
  return <Link {...props} scroll={false} onNavigate={() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }}>{children}</Link>
}

export function Header() {
  const pathname = usePathname()?.replace(/\/$/, '') || '/'
  const [open, setOpen] = useState(false)
  const servicesMenu = useRef(null)
  useEffect(() => {
    function dismiss(event) {
      const menu = servicesMenu.current
      if (!menu?.open) return
      if (event.type === 'keydown' && event.key === 'Escape') {
        menu.open = false
        menu.querySelector('summary')?.focus()
      }
      if (event.type === 'pointerdown' && !menu.contains(event.target)) menu.open = false
    }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', dismiss)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', dismiss)
    }
  }, [])
  return <header className="site-header">
    <div className="wrap nav">
      <svg className="nav-logo-filter" width="0" height="0" aria-hidden="true" focusable="false">
        <defs><filter id="nav-logo-knockout" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -.333333 -.333333 -.333334 0 1"/>
          <feComponentTransfer><feFuncA type="linear" slope="5"/></feComponentTransfer>
          <feComposite in2="SourceAlpha" operator="in"/>
        </filter></defs>
      </svg>
      <HeaderLink href="/" className="brand" aria-label="Movictel home"><img src={media('logo-color.png')} alt="Movictel"/></HeaderLink>
      <button type="button" className="menu-button" aria-expanded={open} aria-controls="navigation" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      <nav className={open ? 'is-open' : ''} id="navigation" aria-label="Main navigation" onClick={event => { if (event.target.closest('a')) setOpen(false) }}>
        <HeaderLink href="/" aria-current={pathname === '/' ? 'page' : undefined}>{navigation[0][0]}</HeaderLink>
        <details ref={servicesMenu} className="nav-services">
          <summary>Services <ChevronDown size={14}/></summary>
          <div className="services-mega" onClick={event => { if (event.target.closest('a')) servicesMenu.current.open = false }}>
            <div className="mega-columns">
              {serviceMenu.map(group => <section key={group.id} aria-label={group.title}>
                <h2>{group.title}</h2>
                <ul>{group.items.map(([label, slug, detail]) => <li key={slug}>
                  <HeaderLink href={'/services/' + slug + '/'}><strong>{label}</strong><small>{detail}</small></HeaderLink>
                </li>)}</ul>
              </section>)}
            </div>
            <div className="mega-footer"><HeaderLink href="/services/">Explore all services <ArrowUpRight size={15}/></HeaderLink></div>
          </div>
        </details>
        {navigation.slice(1).map(([label, href]) => <HeaderLink key={label} href={href} aria-current={pathname === href.replace(/\/$/, '') ? 'page' : undefined}>{label}</HeaderLink>)}
        <HeaderLink className="button mobile-book" href={book}>Book a consultation <ArrowUpRight size={16}/></HeaderLink>
      </nav>
      <HeaderLink className="button nav-book" href={book}>Book a consultation <ArrowUpRight size={16}/></HeaderLink>
    </div>
  </header>
}

function Hero() {
  const reduceMotion = useReducedMotion()
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  async function toggleVideo() {
    const video = videoRef.current
    if (video.paused) {
      try { await video.play() } catch { setPlaying(false) }
    } else {
      video.pause()
    }
  }

  return <section className="hero" id="home" aria-labelledby="hero-title">
    <img className="hero-image" src={media('estate-hero.jpg')} alt="" fetchPriority="high"/>
    {!reduceMotion && <>
      <video ref={videoRef} className="hero-image hero-video" src={media('estate-hero.mp4')}
        poster={media('estate-hero.jpg')} autoPlay loop muted playsInline aria-hidden="true"
        onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)}/>
      <button className="hero-video-toggle" type="button" onClick={toggleVideo}
        aria-label={playing ? 'Pause background video' : 'Play background video'}>
        {playing ? <Pause size={17}/> : <Play size={17}/>}
      </button>
    </>}
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


const strategySteps = [
  { lead: 'From', title: 'Insights', icon: Search, text: 'We study your audience, market and competitors to see what drives interest and where customers drop off.' },
  { lead: 'To', title: 'Ideas', icon: Lightbulb, text: 'We turn what we learn into campaign concepts, clear messaging and pages that give people a reason to act.' },
  { lead: 'To', title: 'Impact', icon: TrendingUp, text: 'We launch, track enquiries and refine the campaign based on what brings qualified leads.' },
]

function Strategy() {
  const reduce = useReducedMotion()
  return <section className="strategy" id="strategy" aria-labelledby="strategy-title">
    <div className="strategy-growth" aria-hidden="true"/>
    <div className="wrap strategy-inner">
      <h2 id="strategy-title">Our strategy</h2>
      <ol className="strategy-steps">
        {strategySteps.map(({ lead, title, icon: Icon, text }) => <li key={title}>
          <StrategyIcon kind={title} fallback={Icon} reducedMotion={reduce}/>
          <div className="strategy-step-copy">
            <h3><span>{lead}</span> {title}</h3>
            <p>{text}</p>
          </div>
        </li>)}
      </ol>
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

const serviceHighlights = {
  'service-social.webp': ['Content calendars', 'Reels and paid campaigns'],
  'service-branding.webp': ['Brand positioning', 'Identity and templates'],
  'service-seo.webp': ['Local listings', 'Search and website audit'],
  'service-writing.webp': ['Website copy', 'Campaign messaging'],
  'service-whatsapp.webp': ['Enquiry replies', 'Visit reminders and handoff'],
  'service-sms.webp': ['Appointment reminders', 'Service alerts'],
  'service-rcs.webp': ['Branded message cards', 'Buttons and SMS fallback'],
  'service-voice.webp': ['Recorded announcements', 'Scheduled calls'],
  'service-website.webp': ['Responsive layouts', 'Pages and enquiry forms'],
  'service-app.webp': ['Task flows', 'Mobile interface prototypes'],
  'service-graphic.webp': ['Social and ad artwork', 'Print-ready files'],
  'service-landing.webp': ['Campaign pages', 'Lead capture and tracking'],
}

function ServiceArtwork({ image }) {
  const isPhoto = image === 'service-social.webp'
  return <figure className="service-figure">
    <div className={'service-art ' + (isPhoto ? 'service-art--photo' : 'service-art--cutout')}>
      <img src={media(image)} alt="" loading="lazy"/>
    </div>
  </figure>
}

function ServiceIndex({ groupId, items }) {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    const cards = [...document.getElementById(groupId).querySelectorAll('.service-card')]
    let frame = 0
    function update() {
      frame = 0
      const headerBottom = document.querySelector('.site-header').getBoundingClientRect().bottom
      const next = cards.findLastIndex(card => card.getBoundingClientRect().top <= headerBottom + 120)
      setActive(Math.max(0, next))
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [groupId])

  function jump(event, index) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const card = document.getElementById(groupId + '-service-' + index)
    const grid = card.parentElement
    const gap = parseFloat(getComputedStyle(grid).rowGap) || 0
    const earlierHeight = [...grid.children].slice(0, index)
      .reduce((height, previous) => height + previous.offsetHeight + gap, 0)
    const headerBottom = document.querySelector('.site-header').getBoundingClientRect().bottom
    event.preventDefault()
    card.focus({ preventScroll: true })
    window.scrollTo({
      top: window.scrollY + grid.getBoundingClientRect().top + earlierHeight - headerBottom - 74,
      behavior: reduce ? 'instant' : 'smooth',
    })
  }

  return <nav className="service-index" aria-label="Services in this category">
    <ul>
      {items.map(([name], index) => <li key={name}>
        <a href={'#' + groupId + '-service-' + index} onClick={event => jump(event, index)}
          aria-current={index === active ? 'location' : undefined}>
          {name}<ArrowDownRight size={15} aria-hidden="true"/>
        </a>
      </li>)}
    </ul>
  </nav>
}

function Services() {
  const reduce = useReducedMotion()
  return <section className="section service-section" id="services" aria-labelledby="services-heading">
    <div className="wrap">
      <div className="section-heading"><RevealHeading id="services-heading">Find the right service.</RevealHeading><p>Choose a specific service or bring marketing, messaging and development together.</p></div>
      {services.map(({ id, label, description, icon: Icon, items }) => <section key={id} id={id} className="service-group" aria-labelledby={id + '-heading'}>
        <div className="service-group-heading">
          <div className="service-group-title">
            <h3 id={id + '-heading'}>{label}</h3>
            <span className="category-icon" aria-hidden="true"><Icon size={17}/></span>
          </div>
          <p>{description}</p>
          <ServiceIndex groupId={id} items={items}/>
        </div>
        <ul className="service-grid">{items.map(([name, detail, image], index) => {
          const deliverables = serviceHighlights[image]
          return <li className="service-card" id={id + '-service-' + index} tabIndex={-1} key={name} style={{ "--stack-index": index }}>

          <a className="service-card-link" href={whatsapp + '?text=' + encodeURIComponent('Hi Movictel, I would like to know more about ' + name + '.')}>
            <div className="service-card-copy">
              <motion.div initial={reduce ? false : { y: 32, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: .25 }}
                transition={{ duration: reduce ? 0 : .55, ease: [.22, 1, .36, 1] }}>
                <h4>{name}</h4><p>{detail}</p>
                <ul className="service-deliverables">{deliverables.map(item => <li key={item}>{item}</li>)}</ul>
                <span className="service-card-action">Ask on WhatsApp <ArrowUpRight size={14}/></span>
              </motion.div>
            </div>
            <ServiceArtwork image={image}/>
          </a>

        </li>})}</ul>
      </section>)}
      <a className="text-link service-directory" href={site + '/services/'}>Browse Movictel’s service pages <ArrowUpRight size={17}/></a>
    </div>
  </section>
}


function Industries() {
  const reduce = useReducedMotion()
  return <section className="section industries industry-showcase" id="industries" aria-labelledby="industries-heading">
    <div className="wrap">
      <div className="section-heading">
        <RevealHeading id="industries-heading">Built for your industry.</RevealHeading>
        <p>Help property buyers book a visit and families find the right school.</p>
      </div>
      <div className="industry-showcase-grid">
        {industries.map(({ id, label, image, alt, title, description, href, action }) => <motion.article
          className="industry-story-card" key={id} id={id}
          initial={reduce ? false : { y: 24 }} whileInView={{ y: 0 }}
          viewport={{ once: true, amount: .18 }} transition={{ duration: reduce ? 0 : .45, ease: 'easeOut' }}>
          <Link href={href} className="industry-story-link">
            <figure className="industry-story-photo">
              <img src={media(image)} alt={alt} width={1440} height={960} loading="lazy"/>
            </figure>
            <div className="industry-story-copy">
              <p className="industry-story-label">{label}</p>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="industry-story-action">{action}<span><ArrowUpRight size={18} aria-hidden="true"/></span></span>
            </div>
          </Link>
        </motion.article>)}
      </div>
    </div>
  </section>
}

function Clients() {
  return <div className="section clients"><div className="wrap"><ClientLogoStrip/></div></div>
}

const testimonialOrder = [testimonials[1], testimonials[0], testimonials[2]]

const clientDemos = [
  { id: 'messaging', title: 'Business messaging' },
  { id: 'sms', title: 'SMS campaigns' },
  { id: 'web', title: 'Web development' },
  { id: 'property', title: 'Property marketing' },
]

function ClientDemo({ demo, active, onActivate, reducedMotion }) {
  const player = useRef(null)
  useEffect(() => {
    const video = player.current
    if (!active) {
      video.muted = true
      if (reducedMotion) video.pause()
      else video.play().catch(() => {})
    }
  }, [active, reducedMotion])

  function open() {
    const video = player.current
    video.muted = false
    onActivate(demo.id)
    video.play().catch(() => {})
  }

  return <article className="client-video-card">
    <div className="client-video-media">
      <video ref={player} muted={!active} autoPlay={!active && !reducedMotion} controls={active} loop={!active} playsInline
        poster={media('client-demo-' + demo.id + '.jpg?v=2')} preload="metadata" src={media('client-demo-' + demo.id + '.mp4?v=2')}
        aria-label={demo.title + ' demo video'}/>
      {!active && <button className="client-video-open" type="button" onClick={open}
        aria-label={'Show ' + demo.title + ' playback controls'}/>}
    </div>
  </article>
}

function Testimonials() {
  const rail = useRef(null)
  const [activeDemo, setActiveDemo] = useState(null)
  const reduce = useReducedMotion()

  function move(direction) {
    const list = rail.current
    const step = list.children[1].offsetLeft - list.children[0].offsetLeft
    const end = list.scrollWidth - list.clientWidth
    let left = list.scrollLeft + direction * step
    if (direction > 0 && list.scrollLeft >= end - 2) left = 0
    if (direction < 0 && list.scrollLeft <= 2) left = end
    list.scrollTo({ left, behavior: reduce ? 'instant' : 'smooth' })
  }

  return <section className="section testimonials" aria-labelledby="testimonials-heading">
    <div className="wrap">
      <div className="review-heading">
        <div>
          <RevealHeading id="testimonials-heading">What our clients say</RevealHeading>
          <p>Feedback from teams using Movictel for messaging and web development.</p>
        </div>
        <div className="testimonial-controls">
          <button className="carousel-button" type="button" aria-label="Previous review" aria-controls="review-rail" onClick={() => move(-1)}><ArrowDown size={18} className="quote-prev"/></button>
          <button className="carousel-button" type="button" aria-label="Next review" aria-controls="review-rail" onClick={() => move(1)}><ArrowDown size={18} className="quote-next"/></button>
        </div>
      </div>
      <ul className="review-rail" id="review-rail" ref={rail} aria-label="Client reviews" tabIndex={0}>
        {testimonialOrder.map(([copy, name, role]) => <li key={name}>
          <figure className="review-card">
            <Quote size={23} aria-hidden="true"/>
            <blockquote>“{copy}”</blockquote>
            <figcaption><strong>{name}</strong><span>{role}</span></figcaption>
          </figure>
        </li>)}
      </ul>
      <div className="client-video-section">
        <h3>Client videos</h3>
        <p className="client-video-note">Sample stock footage</p>
        <div className="client-video-grid">
          {clientDemos.map(demo => <ClientDemo key={demo.id} demo={demo}
            active={activeDemo === demo.id} onActivate={setActiveDemo} reducedMotion={reduce}/>)}
        </div>
      </div>
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

export function Footer() {
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
          <div className="footer-brand"><a href="/" className="brand"><img src={media('logo.webp')} alt="Movictel"/></a>
            <p>Movictel is a digital marketing agency in Jaipur offering internet marketing and cloud communication services.</p>
            <div className="socials">{socials.map(([name, href, mark]) => <a key={name} href={href} aria-label={name}>{mark}</a>)}</div>
          </div>
          <div className="footer-links footer-nav"><h3>Navigate</h3><Link href="/">Home</Link><Link href="/services/">Services</Link>{navigation.slice(1).map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}</div>
          <div className="footer-links footer-services"><h3>Services</h3>{footerServices.map(([label,href]) => <Link key={label} href={href}>{label}</Link>)}</div>
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

function ExploreMovictel() {
  const section = useRef(null)
  const video = useRef(null)
  const visible = useInView(video, { amount: .55 })
  const reducedMotion = useReducedMotion()
  const [revealing, setRevealing] = useState(false)
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] })
  const scale = useTransform(scrollYProgress, [0, .24, .42], [1, 1.38, 1.85])
  const headingOpacity = useTransform(scrollYProgress, [.24, .43], [1, 0])
  const videoVisibility = useTransform(scrollYProgress, progress => progress > .24 ? 'visible' : 'hidden')
  const videoOpacity = useTransform(scrollYProgress, [.24, .43], [0, 1])
  const crop = useTransform(scrollYProgress, [.24, .52], ['inset(23% 22% round 22px)', 'inset(0% 0% round 0px)'])

  useMotionValueEvent(scrollYProgress, 'change', progress => setRevealing(progress >= .31))

  useEffect(() => {
    const player = video.current
    if (!visible || (!revealing && !window.matchMedia('(max-height: 479px)').matches)) player.pause()
    else if (!reducedMotion && player.muted) player.play().catch(() => {})
  }, [visible, revealing, reducedMotion])

  return <section className="home-explore" ref={section} aria-labelledby="home-explore-title">
    <div className="home-explore-stage">
      <motion.h2 id="home-explore-title" style={{ scale, opacity: headingOpacity }}>Explore Movictel</motion.h2>
      <motion.div className="home-explore-picture" style={{ visibility: videoVisibility, opacity: videoOpacity, clipPath: crop }}>
        <video ref={video} controls muted playsInline preload="metadata"
          poster={media('explore-movictel.webp')} src={media('explore-movictel.mp4')}
          width={1920} height={1080} aria-labelledby="home-explore-title"/>
      </motion.div>
    </div>
  </section>
}

export default function App() {
  useSmoothWheel()
  return <MotionConfig reducedMotion="user">
    <Header/>
    <main>
      <Hero/><Services/><Strategy/>
      <ExploreMovictel/>
      <Industries/><Clients/><Testimonials/><FAQ/>
    </main>
    <Footer/>
  </MotionConfig>
}

