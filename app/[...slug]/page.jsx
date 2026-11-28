import { notFound, permanentRedirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SiteChrome, Reveal } from '../site-chrome'
import { hasContentStorage, readPage, readSetting } from '../store'
import { ProjectEnquiry } from '../project-enquiry'
import { ContactPage } from '../contact-page'
import { hasAdminSession } from '../admin/auth'
import { AboutFilm, AboutGallery } from '../about-story'
import { FounderFeature, SelectedWork } from '../selected-work'
import { ClientLogoStrip } from '../client-logo-strip'
import { JournalIndex, JournalArticle, JournalHighlights } from '../journal'
import { enquiryServices } from '../service-menu'
import { ServiceDetail } from '../service-detail'
import { ServiceDirectory } from '../service-directory'
import { redirectedPages } from '../seo'
import { buildMetadata, metadataImage } from '../page-metadata'
import { ManagedSections } from '../managed-sections'
import { editablePageSections, pageLayout } from '../section-layout'
import { LayoutSections, SectionButton, SectionMedia } from '../section-frame'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params
  const key = slug.join('/')
  const preview = (await searchParams).preview === 'draft'
  const page = readPage(key, preview && await hasAdminSession())
  if (!page || key === 'book-a-consultation' || Object.hasOwn(redirectedPages, key)) return {}
  const hero = pageLayout(key, page).find(section => section.id === 'hero')?.content
  return buildMetadata(key, page, preview, metadataImage(page, hero))
}

function getArticles(draft) {
  const blog = readPage('blog', draft)
  return (blog?.articles || []).flatMap(article => {
    const post = readPage('blog/' + article.slug, draft)
    return post ? [{
      ...article, title: post.title, intro: post.intro, topic: post.label, image: post.image,
      imageAlt: post.imageAlt, mediaType: post.mediaType,
    }] : []
  })
}

export default async function Interior({ params, searchParams }) {
  const { slug } = await params
  const key = slug.join('/')
  const { preview, service, demo } = await searchParams
  if (key === 'book-a-consultation') {
    const selected = enquiryServices.some(([, id]) => id === service)
    permanentRedirect('/contact/' + (selected ? '?service=' + encodeURIComponent(service) : '') + '#contact-enquiry')
  }
  if (Object.hasOwn(redirectedPages, key)) permanentRedirect(redirectedPages[key])
  const draft = preview === 'draft' && await hasAdminSession()
  const page = readPage(key, draft)
  if (!page) notFound()
  const layout = pageLayout(key, page)
  const enquiryContent = layout.find(section => section.id === 'enquiry')?.content
  const chrome = { header: readSetting('header'), footer: readSetting('footer') }
  const additional = <ManagedSections sections={editablePageSections(key, page)}/>
  let body

  if (key === 'contact') {
    body = <ContactPage page={page} layout={layout} service={service} demo={demo === 'ivr'} draft={draft}/>
  } else if (key === 'services') {
    const cards = layout.flatMap(section => section.content.cards || [])
    const published = Object.fromEntries(cards.filter(card => /^\/services\/[a-z0-9-]+\/$/.test(card.href))
      .map(card => [card.href, Boolean(readPage(card.href.slice(1, -1), draft))]))
    body = <ServiceDirectory page={page} layout={layout} published={published}
      enquiry={<ProjectEnquiry draft={draft} content={enquiryContent} viaWhatsApp={!hasContentStorage()}/>}/>
  } else if (key.startsWith('services/') && layout.length) {
    body = <ServiceDetail page={page} layout={layout} draft={draft}
      enquiry={<ProjectEnquiry service={slug[1]} content={enquiryContent} draft={draft} viaWhatsApp={!hasContentStorage()}/>}/>
  } else if (key === 'blog') {
    body = <JournalIndex page={{ ...page, articles: getArticles(draft) }} layout={layout} additional={additional}/>
  } else if (key.startsWith('blog/')) {
    const articles = getArticles(draft)
    const seed = readPage('blog', draft)?.articles?.find(item => item.slug === slug[1])
    const article = articles.find(item => item.slug === slug[1]) || seed
    const related = articles.filter(item => item.slug !== slug[1])
      .sort((a, b) => Number(b.topic === article?.topic) - Number(a.topic === article?.topic)).slice(0, 3)
    body = <JournalArticle page={page} article={article} related={related} layout={layout}/>
  } else if (key === 'about') {
    const render = {
      hero: content => <AboutFilm content={content}/>,
      chapters: content => <AboutGallery content={content}/>,
      founder: content => <FounderFeature content={content}/>,
      journal: content => <div className="wrap interior-sections"><JournalHighlights articles={getArticles(draft).slice(0, 3)} content={content}/></div>,
      clients: content => <div className="wrap interior-sections"><ClientLogoStrip headingId="editorial-clients-heading" title={content.heading} logos={content.logos}/></div>,
    }
    body = <main className="interior editorial editorial--about" id="home">
      <LayoutSections layout={layout} hiddenHeading={page.title} render={(id, content) => render[id](content)}/>
      {additional}
    </main>
  } else if (key === 'portfolio' || key.startsWith('portfolio/')) {
    const render = {
      hero: content => <EditorialHero content={content}/>,
      work: content => <div className="wrap interior-sections"><SelectedWork content={content}/></div>,
      clients: content => <div className="wrap interior-sections"><ClientLogoStrip headingId="editorial-clients-heading" title={content.heading} logos={content.logos}/></div>,
    }
    body = <main className="interior editorial editorial--projects" id="home">
      <LayoutSections layout={layout} hiddenHeading={page.title} render={(id, content) => render[id](content)}/>
      {additional}
    </main>
  } else {
    body = <main className={'interior editorial editorial--' + (key.startsWith('portfolio/') ? 'projects' : 'standard')} id="home">
      <EditorialHero content={{ label: page.label, heading: page.title, text: page.intro, media: page.image, imageAlt: page.imageAlt,
        button: { label: 'Book a consultation', href: '/contact/#contact-enquiry' } }} mime={page.mediaType}/>
      {draft && <div className="wrap" role="status">Draft preview</div>}
      {additional}
    </main>
  }

  return <SiteChrome {...chrome}>{body}</SiteChrome>
}

function EditorialHero({ content, mime }) {
  return <section className="interior-hero"><div className="wrap interior-hero-grid">
    <Reveal><p className="interior-label">{content.label}</p><h1>{content.heading}</h1><p>{content.text}</p>
      <SectionButton button={content.button}><ArrowUpRight size={17}/></SectionButton>
    </Reveal>
    {content.media && <figure className="editorial-hero-media"><SectionMedia value={content.media} mime={mime} alt={content.imageAlt} priority/></figure>}
  </div></section>
}
