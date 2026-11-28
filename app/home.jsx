'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { completeChrome } from './chrome-content'
import { LinkIcon } from './link-icon'
import { resolveLinkIcon } from './link-icons'
import { homeContent } from './home-content'
import { mediaUrl, isVideo } from './media-source'
import { SectionFrame, SectionMedia } from './section-frame'
import { ClientLogoStrip } from './client-logo-strip'
import { AnimatePresence, motion, MotionConfig, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUp, ArrowUpRight, Building2, ChevronDown, Cloud, CodeXml, FilePenLine, LayoutTemplate, Megaphone, Monitor, MousePointerClick, Palette, Pause, Play, Smartphone,
  Lightbulb, MapPin, Menu, Search, MessageCircle, MessagesSquare, Minus, Phone, Plus, Radio, TrendingUp, UserRound, X,
} from 'lucide-react'
import { StrategyIcon } from './strategy-icon.jsx'

const media = mediaUrl





const navigation = [['Home', '/'], ['Blog', '/blog/'], ['About', '/about/'], ['Contact', '/contact/']]

function HeaderLink({ children, ...props }) {
  return <Link {...props}>{children}</Link>
}

const serviceMenuIcons = [Cloud, TrendingUp, CodeXml]

const serviceItemIcons = {
  'whatsapp-business-api': MessageCircle,
  ivr: Phone,
  rcs: MessagesSquare,
  'bulk-sms': Megaphone,
  'voice-sms': Radio,
  'real-estate-marketing': Building2,
  'social-media-marketing-jaipur': TrendingUp,
  seo: Search,
  'ppc-advertising': MousePointerClick,
  branding: Palette,
  'content-writing': FilePenLine,
  'web-development': Monitor,
  'mobile-app-development': Smartphone,
  'graphic-design': Palette,
  'landing-page-design': LayoutTemplate,
}

export function Header({ config } = {}) {
  const header = completeChrome('header', config)
  const nav = header.links
  const cta = header.cta
  const pathname = usePathname()?.replace(/\/$/, '') || '/'
  const [open, setOpen] = useState(false)
  const servicesMenu = useRef(null)
  const hoverMenu = useRef(false)

  function openOnHover(event) {
    if (event.pointerType !== 'mouse' || !window.matchMedia('(min-width: 761px)').matches) return
    const menu = servicesMenu.current
    if (menu.open) return
    hoverMenu.current = true
    menu.open = true
  }

  function closeOnLeave(event) {
    if (event.pointerType !== 'mouse' || !hoverMenu.current) return
    const menu = servicesMenu.current
    if (!menu.querySelector('.services-mega').contains(document.activeElement)) menu.open = false
    hoverMenu.current = false
  }

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
      <HeaderLink href="/" className="brand" aria-label="Movictel home"><img src={media(config?.logo || 'logo-color.png')} alt={config?.alt ?? 'Movictel'}/></HeaderLink>
      <button type="button" className="menu-button" aria-expanded={open} aria-controls="navigation" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      <nav className={open ? 'is-open' : ''} id="navigation" aria-label="Main navigation" onClick={event => { if (event.target.closest('a')) setOpen(false) }}>
        <HeaderLink href="/" aria-current={pathname === '/' ? 'page' : undefined}>{config?.homepageLabel ?? navigation[0][0]}</HeaderLink>
        {config?.showServices !== false && <details ref={servicesMenu} className="nav-services" onPointerLeave={closeOnLeave}
          onBlur={event => {
            if (!event.currentTarget.contains(event.relatedTarget) && !event.currentTarget.matches(':hover')) {
              event.currentTarget.open = false
            }
          }}>
          <summary onPointerEnter={openOnHover} onClick={event => {
            if (hoverMenu.current && event.detail && event.currentTarget.parentElement.open) event.preventDefault()
            hoverMenu.current = false
          }}>{config?.servicesLabel ?? 'Services'} <ChevronDown size={14}/></summary>
          <div className="services-mega" onClick={event => { if (event.target.closest('a')) servicesMenu.current.open = false }}>
            <div className="mega-columns">
              {header.serviceGroups.map((group, index) => {
                const Icon = serviceMenuIcons[index % serviceMenuIcons.length]
                return <section key={index} aria-label={group.heading}>
                  <h2><Icon size={18} aria-hidden="true"/>{group.heading}</h2>
                  <ul>{group.links.filter(link => link.href && link.label).map(({ label, href, text }, linkIndex) => {
                    const slug = href.match(/^\/services\/([^/]+)\/?$/)?.[1]
                    const ItemIcon = serviceItemIcons[slug] || ArrowUpRight
                    return <li key={linkIndex}>
                      <HeaderLink href={href}>
                        <span className="mega-item-icon" aria-hidden="true"><ItemIcon size={16}/></span>
                        <span className="mega-item-copy"><strong>{label}</strong><small>{text}</small></span>
                      </HeaderLink>
                    </li>
                  })}</ul>
                </section>
              })}
            </div>
            {header.servicesButton.href && header.servicesButton.label && <div className="mega-footer">
              <HeaderLink href={header.servicesButton.href}>{header.servicesButton.label} <ArrowUpRight size={15}/></HeaderLink>
            </div>}
          </div>
        </details>}
        {nav.map(([label, href]) => <HeaderLink key={label} href={href} aria-current={pathname === href.replace(/\/$/, '') ? 'page' : undefined}>{label}</HeaderLink>)}
        {config?.showCta !== false && <HeaderLink className="button mobile-book" href={cta[1]}>{cta[0]} <ArrowUpRight size={16}/></HeaderLink>}
      </nav>
      {config?.showCta !== false && <HeaderLink className="button nav-book" href={cta[1]}>{cta[0]} <ArrowUpRight size={16}/></HeaderLink>}
    </div>
  </header>
}

function ContentButton({ button, className = 'button', icon: Icon = ArrowUpRight }) {
  if (!button.label || !button.href) return null
  return <Link className={className} href={button.href}>{button.label} <Icon size={17} aria-hidden="true"/></Link>
}

function Hero({ page, content, defaultTitle }) {
  const video = isVideo(content.media, content.media === page.image ? page.mediaType : '')
  const poster = video ? media(content.poster) : undefined
  const headlines = content.rotatingHeadlines
  const reduceMotion = useReducedMotion()
  const [service, setService] = useState(0)
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

  useEffect(() => {
    const video = videoRef.current
    const timer = reduceMotion || !headlines.length ? null : window.setInterval(() => setService(index => (index + 1) % headlines.length), 2500)
    if (video && reduceMotion) {
      video.pause()
    } else {
      video?.play().catch(() => {})
    }
    return () => window.clearInterval(timer)
  }, [reduceMotion, content.media, headlines.length])

  return <section className="hero home-hero" id="home-hero" aria-labelledby="hero-title">
    {(poster || (!video && content.media)) && <img className="hero-image" src={poster || media(content.media)} alt={content.imageAlt} fetchPriority="high"/>}
    {video && <video ref={videoRef} className="hero-image hero-video" src={media(content.media)}
      poster={poster} loop muted playsInline aria-hidden="true"
      onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)}/>}
    {video && <button className="hero-video-toggle" type="button" onClick={toggleVideo}
      aria-label={playing ? 'Pause background video' : 'Play background video'}>
      {playing ? <Pause size={17}/> : <Play size={17}/>}
    </button>}
    <div className="wrap hero-layout">
      <div className="hero-copy">
        <p className="hero-channels">{content.label}</p>
        <h1 id="hero-title">
          {!content.rotateHeadlines || !headlines.length || content.heading !== defaultTitle ? <span>{content.heading}</span> : <>
          <span className="sr-only">{content.heading}</span>
          <span aria-hidden="true">{content.rotatingPrefix}</span>
          <span className="hero-service" aria-hidden="true">
            {headlines.map((label, index) => <span key={label} data-active={index === service % headlines.length}>{label}</span>)}
          </span>
          <span aria-hidden="true">{content.rotatingSuffix}</span></>}
        </h1>
        <p className="hero-intro">{content.text}</p>
        <div className="hero-actions cms-buttons" data-position={content.buttonPosition}>
          <ContentButton button={content.primaryButton}/>
          <ContentButton button={content.secondaryButton} className="button secondary" icon={ArrowDown}/>
        </div>
      </div>
      <div className="hero-index" aria-label="Explore Movictel services">
        {content.quickLinks.map((button, index) => <ContentButton key={index} button={button} className="" icon={ArrowDownRight}/>)}
      </div>
    </div>
  </section>
}


function Strategy({ content }) {
  const reduce = useReducedMotion()
  return <section className="strategy" id="strategy" aria-labelledby="strategy-title">
    <div className="strategy-growth" aria-hidden="true"/>
    <div className="wrap strategy-inner">
      <h2 id="strategy-title">{content.heading}</h2>
      <ol className="strategy-steps">
        {content.steps.map(({ prefix, heading, text }, index) => <li key={index}>
          <StrategyIcon kind={['Insights', 'Ideas', 'Impact'][index % 3]} fallback={[Search, Lightbulb, TrendingUp][index % 3]} reducedMotion={reduce}/>
          <div className="strategy-step-copy">
            <h3><span>{prefix}</span> {heading}</h3>
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

function ServiceArtwork({ image, alt }) {
  const isPhoto = image === 'service-social.webp'
  return <figure className="service-figure">
    <div className={'service-art ' + (isPhoto ? 'service-art--photo' : 'service-art--cutout')}>
      <SectionMedia value={image} alt={alt}/>
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
      {items.map(([name], index) => <li key={index}>
        <a href={'#' + groupId + '-service-' + index} onClick={event => jump(event, index)}
          aria-current={index === active ? 'location' : undefined}>
          {name}<ArrowDownRight size={15} aria-hidden="true"/>
        </a>
      </li>)}
    </ul>
  </nav>
}

function Services({ content }) {
  const reduce = useReducedMotion()
  return <section className="section service-section" id="services" aria-labelledby="services-heading">
    <div className="wrap">
      <div className="section-heading"><RevealHeading id="services-heading">{content.heading}</RevealHeading><p>{content.text}</p></div>
      {Object.entries(content.groups).map(([id, group]) => {
        const Icon = { marketing: TrendingUp, promote: MessageCircle, development: CodeXml }[id]
        return <section key={id} id={id} className="service-group" aria-labelledby={id + '-heading'}>
        <div className="service-group-heading">
          <div className="service-group-title">
            <h3 id={id + '-heading'}>{group.heading}</h3>
            <span className="category-icon" aria-hidden="true"><Icon size={17}/></span>
          </div>
          <p>{group.text}</p>
          <ServiceIndex groupId={id} items={group.cards.map(card => [card.heading])}/>
        </div>
        <ul className="service-grid">{group.cards.map(({ heading, text, image, imageAlt, deliverables, button }, index) => {
          const CardLink = button.href ? Link : 'div'
          return <li className="service-card" id={id + '-service-' + index} tabIndex={-1} key={index} style={{ "--stack-index": index }}>

          <CardLink className="service-card-link" {...(button.href ? { href: button.href } : {})}>
            <div className="service-card-copy">
              <motion.div initial={reduce ? false : { y: 32, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, amount: .25 }}
                transition={{ duration: reduce ? 0 : .55, ease: [.22, 1, .36, 1] }}>
                <h4>{heading}</h4><p>{text}</p>
                <ul className="service-deliverables">{deliverables.map(item => <li key={item}>{item}</li>)}</ul>
                {button.href && button.label && <span className="service-card-action">{button.label} <ArrowUpRight size={14}/></span>}
              </motion.div>
            </div>
            <ServiceArtwork image={image} alt={imageAlt}/>
          </CardLink>

        </li>})}</ul>
      </section>})}
      <ContentButton button={content.directoryButton} className="text-link service-directory"/>
    </div>
  </section>
}


function IvrFeature({ content }) {
  return <section className="ivr-feature" id="ivr" aria-labelledby="ivr-feature-title">
    <div className="wrap ivr-feature-grid">
      <div>
        <h2 id="ivr-feature-title">{content.heading}</h2>
        <h3>{content.subheading}</h3>
        <p>{content.text}</p>
        <ul>{content.points.map((point, index) => <li key={index}>{point}</li>)}</ul>
        <div className="ivr-feature-actions cms-buttons" data-position={content.buttonPosition}>
          <ContentButton button={content.primaryButton}/>
          <ContentButton button={content.secondaryButton} className="ivr-feature-link"/>
        </div>
      </div>
      <SectionMedia value={content.media} alt={content.imageAlt}/>
    </div>
  </section>
}

function Clients({ content }) {
  return <div className="section clients"><div className="wrap"><ClientLogoStrip title={content.heading} logos={content.logos}/></div></div>
}

function ClientDemo({ demo, active, onActivate, reducedMotion }) {
  const player = useRef(null)
  useEffect(() => {
    const video = player.current
    if (video && !active) {
      video.muted = true
      if (reducedMotion) video.pause()
      else video.play().catch(() => {})
    }
  }, [active, reducedMotion])

  function open() {
    const video = player.current
    video.muted = false
    onActivate(demo)
    video.play().catch(() => {})
  }

  return <article className="client-video-card">
    <div className="client-video-media">
      {isVideo(demo.media) ? <>
      <video ref={player} muted={!active} autoPlay={!active && !reducedMotion} controls={active} loop={!active} playsInline
        poster={media(demo.poster)} preload="metadata" src={media(demo.media)}
        aria-label={demo.heading + ' demo video'}/>
      {!active && <button className="client-video-open" type="button" onClick={open}
        aria-label={'Show ' + demo.heading + ' playback controls'}/>}
      </> : <SectionMedia value={demo.media} alt={demo.heading}/>}
    </div>
  </article>
}

function Testimonials({ content }) {
  const rail = useRef(null)
  const [activeReview, setActiveReview] = useState(1)
  const reduce = useReducedMotion()
  const count = content.reviews.length

  function centerReview(index, behavior) {
    const list = rail.current
    const card = list.children[index]
    if (!card) return
    list.scrollTo({ left: card.offsetLeft + (card.offsetWidth - list.clientWidth) / 2, behavior })
  }

  useEffect(() => {
    centerReview(content.reviews.length > 1 ? 1 : 0, 'instant')
  }, [])

  function updateActiveReview() {
    const list = rail.current
    const center = list.scrollLeft + list.clientWidth / 2
    const distances = Array.from(list.children, card => Math.abs(card.offsetLeft + card.offsetWidth / 2 - center))
    setActiveReview(distances.indexOf(Math.min(...distances)))
  }

  function move(direction) {
    if (!count) return
    centerReview((activeReview + direction + count) % count, reduce ? 'instant' : 'smooth')
  }

  return <section className="section testimonials" aria-labelledby="testimonials-heading">
    <div className="wrap">
      <div className="review-heading">
        <div>
          <span className="review-label">{content.label}</span>
          <h2 id="testimonials-heading">{content.heading === homeContent.reviews.heading ? <>We became part of their <em>success stories</em></> : content.heading}</h2>
          <p>{content.text}</p>
        </div>
        <div className="testimonial-controls">
          <button className="carousel-button" type="button" aria-label="Previous review" aria-controls="review-rail" onClick={() => move(-1)}><ArrowLeft size={18}/></button>
          <button className="carousel-button" type="button" aria-label="Next review" aria-controls="review-rail" onClick={() => move(1)}><ArrowRight size={18}/></button>
        </div>
      </div>
      <ul className="review-rail" id="review-rail" ref={rail} aria-label="Client reviews" tabIndex={0}
        onScroll={updateActiveReview} onKeyDown={event => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
          event.preventDefault()
          move(event.key === 'ArrowLeft' ? -1 : 1)
        }}>
        {content.reviews.map(({ text, name, role }, index) => <li key={index} className={index === activeReview ? 'is-featured' : undefined}>
          <figure className="review-card">
            <span className="review-quote" aria-hidden="true">“</span>
            <blockquote>{text}</blockquote>
            <figcaption>
              <span className="review-avatar" aria-hidden="true"><UserRound size={24}/></span>
              <div><strong>{name}</strong><span>{role}</span></div>
            </figcaption>
          </figure>
        </li>)}
      </ul>
      <div className="review-pagination" aria-label="Select a client review">
        {content.reviews.map(({ name, role }, index) => <button key={index} type="button"
          aria-label={role === 'Sample review' ? 'Show sample review for ' + name : 'Show review from ' + name} aria-current={index === activeReview ? 'true' : undefined}
          aria-controls="review-rail" onClick={() => centerReview(index, reduce ? 'instant' : 'smooth')}/>)}
      </div>
    </div>
  </section>
}

function ClientVideos({ content }) {
  const [active, setActive] = useState(null)
  const reduce = useReducedMotion()
  return <section className="testimonials client-videos"><div className="wrap client-video-section">
    <h2>{content.heading}</h2>
    <p className="client-video-note">{content.text}</p>
    <div className="client-video-grid">
      {content.videos.map((demo, index) => <ClientDemo key={index} demo={demo}
        active={active === demo} onActivate={setActive} reducedMotion={reduce}/>)}
    </div>
  </div></section>
}

function FAQ({ content }) {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  return <section className="section faq-section" id="faq"><div className="wrap faq-layout">
    
    <div className="faq-aside">
      <div><RevealHeading>{content.heading}</RevealHeading><p>{content.text}</p></div>
      <figure className="faq-photo"><SectionMedia value={content.media} alt={content.imageAlt}/><figcaption><span>{content.caption}</span><ContentButton button={content.button}/></figcaption></figure>
    </div>

    <div className="accordion">{content.questions.map(({ question, answer }, i) => <div key={i} className={active === i ? 'is-open' : undefined}>
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

export function Closing({ content = homeContent.closing }) {
  return <section className="closing" id="contact" aria-labelledby="closing-title">
    <div className="wrap closing-layout">
      <div><RevealHeading id="closing-title">{content.heading === homeContent.closing.heading ? <>Ready to grow<br className="desktop-break"/> your business?</> : content.heading}</RevealHeading>
        <p>{content.text}</p></div>
      <div className="cms-button-slot" data-position={content.buttonPosition}><ContentButton button={content.button}/></div>
    </div>
  </section>
}

export function Footer({ config, omitClosing = false } = {}) {
  const footer = completeChrome('footer', config)
  return <>
    {!omitClosing && footer.showClosing && <Closing content={footer.closing}/>}
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand"><a href="/" className="brand"><img src={media(footer.logo || 'logo.webp')} alt={footer.alt}/></a>
            <p>{footer.brandText}</p>
            <div className="socials">{footer.socials.map(([name, href, selected = 'auto'], index) => {
              const icon = resolveLinkIcon(selected, href)
              return <a key={index} href={href} aria-label={name} title={name}>
                {icon === 'none' ? name : <LinkIcon icon={icon}/>}
              </a>
            })}</div>
          </div>
          {config ? config.columns.map(({ title, links }, index) => <div className="footer-links" key={index}><h3>{title}</h3>{links.map(([label, href, icon = 'none'], i) => <Link key={i} href={href}>
            <LinkIcon icon={resolveLinkIcon(icon, href)} size={15}/> {label}
          </Link>)}</div>) : <>
          <div className="footer-links footer-nav"><h3>Navigate</h3><Link href="/">Home</Link><Link href="/services/">Services</Link>{navigation.slice(1).map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}</div>
          <div className="footer-links footer-services"><h3>Services</h3>{footerServices.map(([label,href]) => <Link key={label} href={href}>{label}</Link>)}</div>
          </>}
          <div className="footer-links footer-contact"><h3>{footer.contact.heading}</h3>
            <address><MapPin size={19}/> {footer.contact.text}</address>
            {footer.contact.phone && <a href={'tel:' + footer.contact.phone.replace(/[^+0-9]/g, '')}><Phone size={17}/> {footer.contact.phone}</a>}
            {footer.contact.whatsapp.href && <a href={footer.contact.whatsapp.href}><MessageCircle size={17}/> {footer.contact.whatsapp.label}</a>}
          </div>
        </div>
        <div className="copyright"><span>{config?.copyright ?? ('© ' + new Date().getFullYear() + ' Movictel. All rights reserved.')}</span><a href="#home">{footer.backToTop} <ArrowUp size={17}/></a></div>
      </div>
      <div className="footer-wordmark" aria-hidden="true">movictel</div>
    </footer>
  </>
}

function ExploreMovictel({ content }) {
  const section = useRef(null)
  const video = useRef(null)
  const visible = useInView(section, { amount: .55 })
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
    if (!player) return
    if (!visible || (!revealing && !window.matchMedia('(max-height: 479px)').matches)) player.pause()
    else if (!reducedMotion && player.muted) player.play().catch(() => {})
  }, [visible, revealing, reducedMotion, content.media])

  return <section className="home-explore" ref={section} aria-labelledby="home-explore-title">
    <div className="home-explore-stage">
      <motion.h2 id="home-explore-title" style={{ scale, opacity: headingOpacity }}>{content.heading}</motion.h2>
      <motion.div className="home-explore-picture" style={{ visibility: videoVisibility, opacity: videoOpacity, clipPath: crop }}>
        {isVideo(content.media) ? <video ref={video} muted loop playsInline preload="metadata"
          poster={media(content.poster)} src={media(content.media)} width={1920} height={1080} aria-labelledby="home-explore-title"/>
          : <SectionMedia value={content.media} alt={content.imageAlt}/>}
      </motion.div>
    </div>
  </section>
}

const homeRenderers = {
  hero: Hero, services: Services, strategy: Strategy, explore: ExploreMovictel, ivr: IvrFeature,
  clients: Clients, reviews: Testimonials, 'client-videos': ClientVideos, faq: FAQ, closing: Closing,
}

export default function App({ enquiry, page, defaultTitle, header, footer, sections, layout }) {
  return <MotionConfig reducedMotion="user">
    <Header config={header}/>
    <main id="home">
      {!layout.find(section => section.id === 'hero')?.visible && <h1 className="sr-only">{page.title}</h1>}
      {layout.map(section => {
        const Component = homeRenderers[section.id]
        return <React.Fragment key={section.id}>
          {section.id === 'enquiry' && sections}
          <SectionFrame section={section}>{Component ? <Component content={section.content} page={page} defaultTitle={defaultTitle}/> : enquiry}</SectionFrame>
        </React.Fragment>
      })}
    </main>
    <Footer config={footer} omitClosing/>
  </MotionConfig>
}

