import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowUpRight, Building2, MessageCircle, Phone, TrendingUp } from 'lucide-react'
import { SiteChrome, Reveal } from '../site-chrome'
import { readPage } from '../store'
import { ContactPage, EnquiryForm } from '../contact-page'
import { hasAdminSession } from '../admin/auth'
import { FlowPreview } from '../site-chrome'
import { Scenario } from '../scenario'
import { AboutFilm, AboutGallery } from '../about-story'
import { FounderFeature, SelectedWork } from '../selected-work'
import { ClientLogoStrip } from '../client-logo-strip'
import { JournalIndex, JournalArticle, JournalHighlights } from '../journal'
import { serviceMenu } from '../service-menu'
import { serviceBasics } from '../service-basics'
import { serviceGuides } from '../service-guides'
import { ServiceWorkflow } from '../service-workflow'
import { PropertyStory, PropertyHero } from '../property-story'
import { ServiceDetail, serviceImages } from '../service-detail'

const icons = { building: Building2, messaging: MessageCircle, phone: Phone, growth: TrendingUp }

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const page = readPage(slug.join('/'))
  return page ? { title: page.seoTitle || page.title, description: page.seoDescription || page.intro } : {}
}

export default async function Interior({ params, searchParams }) {
  const { slug } = await params
  const key = slug.join('/')
  if (key === 'industries') permanentRedirect('/#industries')
  if (key === 'portfolio-single-page') permanentRedirect('/portfolio/residential-campaign/')
  const { sent, invalid, preview, service } = await searchParams
  const draft = preview === 'draft' && await hasAdminSession()
  const page = readPage(key, draft)
  if (!page) notFound()
  if (key === 'services/real-estate-marketing') return <SiteChrome>
    <main className="property-story" id="home">
      <PropertyHero page={page} draft={draft}/>
      <PropertyStory/>
    </main>
  </SiteChrome>

  if (key === 'contact') return <SiteChrome><ContactPage page={page} service={service} sent={sent} invalid={invalid} draft={draft}/></SiteChrome>
  if (key === 'blog') return <SiteChrome><JournalIndex page={page}/></SiteChrome>
  if (key.startsWith('blog/')) {
    const articles = readPage('blog').articles
    const article = articles.find(item => item.slug === slug[1])
    const related = articles.filter(item => item.slug !== slug[1])
      .sort((a, b) => Number(b.topic === article?.topic) - Number(a.topic === article?.topic)).slice(0, 3)
    return <SiteChrome><JournalArticle page={page} article={article} related={related}/></SiteChrome>
  }

  const guideKey = key.startsWith('services/') ? slug[1] : ''
  const guide = Object.hasOwn(serviceGuides, guideKey) ? serviceGuides[guideKey] : null
  const basics = Object.hasOwn(serviceBasics, guideKey) ? serviceBasics[guideKey] : null
  const serviceGroup = serviceMenu.find(group => group.items.some(([, id]) => id === guideKey))
  if (guide && basics) return <SiteChrome><ServiceDetail page={page} basics={basics} guide={guide} slug={guideKey} draft={draft}/></SiteChrome>
  const variant = key === 'services' ? 'directory' :
    key === 'services/real-estate-marketing' ? 'real-estate' :
    key === 'services/social-media-marketing-jaipur' ? 'social' :
    page.scenario ? 'communications' : key.startsWith('portfolio') ? 'projects' :
    key === 'about' ? 'about' : key.startsWith('blog') ? 'journal' : page.form ? 'contact' : 'standard'

  if (key === 'services') {
    return <SiteChrome>
      <main className="service-showcase" id="home">
        <section className="service-showcase-hero">
          <div className="service-showcase-hero-image" style={{ backgroundImage: `url("${asset(page.image || 'estate-hero.jpg')}")` }} aria-hidden="true"/>
          <div className="wrap service-showcase-hero-copy">
            <p className="service-showcase-eyebrow">Movictel services</p>
            <h1>Good work starts with a clear next step.</h1>
            <p>{page.intro}</p>
            <Link className="button" href="/book-a-consultation/">Book a consultation <ArrowUpRight size={17}/></Link>
          </div>
          <nav className="service-showcase-nav wrap" aria-label="Service categories">{serviceMenu.map(group => <a key={group.id} href={'#' + group.id}>{group.title}<ArrowUpRight size={15}/></a>)}</nav>
        </section>

        <div className="wrap service-showcase-body">
          <section className="service-showcase-intro"><h2>One team for the whole customer journey.</h2><p>From the first campaign to the follow-up conversation, choose the work that will help your customers take the next step.</p></section>
          {serviceMenu.map(group => <section className="service-directory-group" id={group.id} key={group.id}>
            <div className="service-directory-heading"><p>{group.title}</p><h2>{group.id === 'marketing' ? 'Get discovered and build demand.' : group.id === 'promote' ? 'Keep conversations moving.' : 'Make the next step easier.'}</h2></div>
            <div className="service-directory-grid">{group.items.map(([title, id, description], index) => {
              const servicePage = readPage('services/' + id)
              const image = servicePage?.image?.startsWith('/') ? servicePage.image : serviceImages[id]
              return <Link className="service-directory-card" href={'/services/' + id + '/'} key={id}>
                <img src={asset(image)} alt="" loading="lazy"/><div><span>0{index + 1}</span><h3>{title}<ArrowUpRight size={18}/></h3><p>{description}</p></div>
              </Link>
            })}</div>
          </section>)}
          <ServiceClosingCta/>
        </div>
      </main>
    </SiteChrome>
  }

  return <SiteChrome>
    <main className={'interior editorial editorial--' + variant + (guide ? ' detailed-service' : '') + (serviceGroup ? ' service-family--' + serviceGroup.id : '')} id="home">
      {key === 'about' ? <>
        <AboutFilm title="We help real estate projects reach the right buyers." intro={page.intro}/>
        <AboutGallery/>
      </> : <section className="interior-hero">
        <div className="wrap interior-hero-grid">
          <Reveal>
            <p className="interior-label">{basics?.[0] || page.kicker || serviceGroup?.title || page.label}</p>
            <h1>{page.title}</h1><p>{page.intro}</p>
            {!page.form && <Link className="button" href={guide ? '/book-a-consultation/?service=' + encodeURIComponent(guideKey) : '/book-a-consultation/'}>Book a consultation <ArrowUpRight size={17}/></Link>}
          </Reveal>
          {page.image && <figure className="editorial-hero-media"><PageMedia item={page} priority/></figure>}
        </div>
      </section>}
      {guide && <nav className="service-jump" aria-label="On this service page">
        <div className="wrap"><a href="#service-overview">What it is</a><a href="#service-example">Example</a><a href="#service-process">Process</a><a href="#service-brief">Project brief</a></div>
      </nav>}
      <div className="wrap interior-sections" id={guide ? 'service-overview' : undefined}>
        {draft && <p role="status">Draft preview</p>}
        {variant === 'directory' && <FeaturedServices/>}
        {basics && <ServiceBasics basics={basics}/>}
        {page.scenario && <Scenario scenario={page.scenario}/>}
        {page.platforms && <section className="platform-directory">
          <h2>Choose the channels that fit your audience.</h2>
          <div className="platform-grid">{page.platforms.map(([title, image, text]) => <article key={title}>
            <img alt="" src={'/media/live-' + image + '.webp'} loading="lazy"/><h3>{title}</h3><p>{text}</p>
          </article>)}</div>
        </section>}
        {page.form && <EnquiryForm service={service} sent={sent} invalid={invalid}/>}
        {key === 'about' && <FounderFeature/>}
        {key === 'about' && <JournalHighlights articles={readPage('blog').articles.slice(0, 3)}/>}
        {key === 'portfolio' && <SelectedWork/>}
        {page.sections.filter(section => section.visible !== false && !(key === 'about' && (section.image === 'live-founder.webp' || ['A team that works across the full journey', 'Explore what we do'].includes(section.heading)))).map((section, index) => {
          const Icon = Object.hasOwn(icons, section.icon) ? icons[section.icon] : null
          return <Reveal className="interior-section" key={section.id || index} style={{ backgroundColor: section.background || undefined }}>
          <div id={section.id} className="editorial-section-copy">
            {Icon && <Icon className="interior-section-icon" aria-hidden="true" size={28}/>}
            {variant === 'real-estate' && <span className="editorial-step">0{index + 1}</span>}
            <h2>{section.heading}</h2><p>{section.text}</p>
            {section.points?.length > 0 && <ul className="editorial-points">{section.points.map(point => <li key={point}>{point}</li>)}</ul>}
            {section.steps?.length > 0 && <FlowPreview steps={section.steps}/>}
            {section.links && <div className="interior-links">{section.links.map(([label, href]) => <Link key={href} href={href}>{label} <ArrowUpRight size={15}/></Link>)}</div>}
          </div>
          {section.image && <figure className="editorial-section-media"><PageMedia item={section}/></figure>}
        </Reveal>
        })}
        {page.clients && <ClientLogoStrip headingId="editorial-clients-heading"/>}
        {guide && <ServiceGuide guide={guide} service={guideKey}/>}
        {page.faq && <section className="editorial-faq"><h2>Before you get started</h2>{page.faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>}
      </div>
    </main>
  </SiteChrome>
}

function asset(value) { return value.startsWith('/') ? value : '/media/' + value }

function PageMedia({ item, priority }) {
  const src = asset(item.image)
  return item.mediaType?.startsWith('video/') || /\.mp4$/i.test(src)
    ? <video src={src} controls playsInline preload="metadata" aria-label={item.imageAlt || item.heading || item.title}/>
    : <img src={src} alt={item.imageAlt || ''} loading={priority ? undefined : 'lazy'} fetchPriority={priority ? 'high' : undefined}/>
}


function ServiceGuide({ guide, service }) {
  const [label, title, details] = guide.sample
  return <>
    <section className="service-example" id="service-example">
      <div><p>{label}</p><h2>{title}</h2></div>
      <p>{details}</p>
    </section>
    <section className="service-process" id="service-process">
      <h2>How the work progresses</h2>
      <ServiceWorkflow items={guide.workflow}/>
    </section>
    <section className="service-brief" id="service-brief">
      <div><h2>What to bring to the first call</h2><ul>{guide.inputs.map(input => <li key={input}>{input}</li>)}</ul></div>
      <Link className="button" href={'/book-a-consultation/?service=' + encodeURIComponent(service)}>Discuss your project <ArrowUpRight size={17}/></Link>
    </section>
  </>
}

const featuredServices = [
  ['Real estate marketing', 'real-estate-marketing', 'live-real-estate.webp', 'Plan the launch, capture enquiries and help buyers book a visit.'],
  ['Social media marketing', 'social-media-marketing-jaipur', 'live-social.webp', 'Build a calendar your team can use and connect posts to campaigns.'],
  ['Business messaging', 'whatsapp-business-api', 'wa.jpg', 'Answer enquiries and keep appointment follow-up in one conversation.'],
]

function FeaturedServices() {
  return <section className="featured-services">
    <h2>Start with the work you need done</h2>
    <div>{featuredServices.map(([title, path, image, text]) => <Link key={path} href={'/services/' + path + '/'}>
      <img src={asset(image)} alt="" loading="lazy"/>
      <h3>{title} <ArrowUpRight size={18} aria-hidden="true"/></h3>
      <p>{text}</p>
    </Link>)}</div>
  </section>
}

function ServiceBasics({ basics }) {
  const [, description, useCase, deliverables] = basics
  return <section className="service-basics" aria-labelledby="service-basics-title">
    <div>
      <h2 id="service-basics-title">What it is</h2>
      <p className="service-basics-definition">{description}</p>
      <h3>When it helps</h3>
      <p>{useCase}</p>
    </div>
    <div className="service-basics-output">
      <h3>What you can get</h3>
      <ul>{deliverables.map(item => <li key={item}>{item}</li>)}</ul>
    </div>
  </section>
}

function ServiceClosingCta({ service }) {
  return <section className="service-showcase-cta"><p>Have a project in mind?</p><h2>Let’s plan the next step.</h2><Link className="button" href={'/book-a-consultation/' + (service ? '?service=' + encodeURIComponent(service) : '')}>Discuss your project <ArrowUpRight size={17}/></Link></section>
}
