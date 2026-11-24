'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'

export function JournalIndex({ page }) {
  const [topic, setTopic] = useState('')
  const reduced = useReducedMotion()
  const [featured] = page.articles
  const topics = [...new Set(page.articles.map(article => article.topic))]
  const entries = topic ? page.articles.filter(article => article.topic === topic) : page.articles

  return <main className="journal" id="home">
    <section className="journal-intro journal-photo-hero" aria-labelledby="journal-title">
      {featured && <motion.div className="journal-hero-photo" aria-hidden="true"
        initial={reduced ? false : { scale: 1.035 }} animate={{ scale: 1 }}
        transition={{ duration: reduced ? 0 : .72, ease: 'easeOut' }}>
        <img src={media(featured.image)} alt="" fetchPriority="high"/>
      </motion.div>}
      <div className="wrap journal-photo-inner">
        <div className="journal-masthead-copy">
          <h1 id="journal-title">{page.title}</h1>
          <p>{page.intro}</p>
          <div className="journal-hero-actions">
            {featured && <Link className="button" href={articleHref(featured)}>Read the featured guide <ArrowUpRight size={17}/></Link>}
            <a href="#articles">Browse all guides <ArrowDown size={17}/></a>
          </div>
        </div>
        {featured && <Link className="journal-hero-credit" href={articleHref(featured)}>
          <div><span>Featured guide</span><p>{featured.title}</p></div>
          <ArrowUpRight size={19} aria-hidden="true"/>
        </Link>}
      </div>
    </section>
    <div className="wrap journal-content">
      <section className="journal-library" id="articles" aria-labelledby="journal-library-heading">
        <h2 id="journal-library-heading">Browse guides</h2>
        <div className="journal-filters" role="group" aria-label="Filter guides by topic">
          {['', ...topics].map(item => <button type="button" key={item} aria-pressed={item === topic}
            onClick={() => setTopic(item)}>{item || 'All topics'}</button>)}
        </div>
        <motion.div className="journal-entries" key={topic} initial={reduced ? false : { opacity: .7, y: 7 }}
          animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .2 }}>
          {entries.map(article => <ArticleTile article={article} key={article.slug}/>)}
        </motion.div>
      </section>
    </div>
  </main>
}

export function JournalArticle({ page, article, related }) {
  const body = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: body, offset: ['start .22', 'end .75'] })
  const { scrollY } = useScroll()
  const [activeSection, setActiveSection] = useState(0)
  useMotionValueEvent(scrollY, 'change', () => {
    if (!body.current) return
    const blocks = Array.from(body.current.querySelectorAll(':scope > section'))
    const index = blocks.findLastIndex(section => section.getBoundingClientRect().top <= 160)
    setActiveSection(Math.max(0, index))
  })
  const sections = page.sections.filter(section => section.visible !== false)
  const readTime = Math.max(1, Math.ceil([page.intro, ...sections.flatMap(section => [section.text, ...(section.points || [])])].join(' ').split(/\s+/).length / 210))

  return <main className="journal journal-article" id="home">
    {!reduced && <motion.div className="journal-reading-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true"/>}
    <div className="wrap">
      <div className="journal-article-lead">
        <header className="journal-article-header">
          <Link href="/blog/">← All guides</Link>
          <p className="journal-topic">{page.label} · {readTime} min read</p>
          <h1>{page.title}</h1><p>{page.intro}</p>
        </header>
        {page.image && <motion.div className="journal-article-art"
          initial={reduced ? false : { y: 10, opacity: .88 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: reduced ? 0 : .4, ease: 'easeOut' }}>
          <Cover article={{ ...article, image: page.image }} featured/>
        </motion.div>}
      </div>
      <div className="journal-reading-layout">
        {sections.length > 1 && <nav aria-label="In this guide"><h2>In this guide</h2>
          <ol>{sections.map((section, index) => <li key={index}><a href={'#guide-' + (index + 1)} aria-current={index === activeSection ? 'location' : undefined}>{section.heading}</a></li>)}</ol>
        </nav>}
        <article ref={body} className="journal-prose">
          {sections.map((section, index) => <section id={'guide-' + (index + 1)} key={index}>
            <h2>{section.heading}</h2>{section.text && <p>{section.text}</p>}
            {section.image && <img src={media(section.image)} alt={section.imageAlt || ''} loading="lazy"/>}
            {section.points?.length > 0 && <ul>{section.points.map((point, i) => <li key={i}>{point}</li>)}</ul>}
            {section.links?.length > 0 && <ul>{section.links.map(([label, href], i) => <li key={i}><Link href={href}>{label}</Link></li>)}</ul>}
          </section>)}
          <Link className="button" href="/book-a-consultation/">Talk about your project <ArrowUpRight size={16}/></Link>
        </article>
      </div>
      {related.length > 0 && <section className="journal-library journal-related"><h2>Keep reading</h2>
        <div className="journal-entries">{related.map(item => <ArticleTile article={item} key={item.slug}/>)}</div>
      </section>}
    </div>
  </main>
}

export function JournalHighlights({ articles }) {
  return <section className="selected-work about-journal" aria-labelledby="about-journal-heading">
    <header>
      <div><h2 id="about-journal-heading">From the blog</h2>
        <p>Practical guides to launching property campaigns, creating content and following up on enquiries.</p>
      </div>
      <Link href="/blog/">Browse all guides <ArrowUpRight size={16} aria-hidden="true"/></Link>
    </header>
    <div className="journal-entries">{articles.map(article => <ArticleTile key={article.slug} article={article}/>)}</div>
  </section>
}

function ArticleTile({ article }) {
  return <article className="journal-entry"><Link href={articleHref(article)}>
    <Cover article={article}/>
    <div className="journal-entry-copy"><p className="journal-topic">{article.topic}</p>
      <h3>{article.title} <ArrowUpRight className="journal-tile-arrow" size={18} aria-hidden="true"/></h3><p>{article.intro}</p>
    </div>
  </Link></article>
}

function Cover({ article, featured }) {
  return <figure className={'journal-cover' + (article.cutout ? ' journal-cover--cutout' : '')}>
    <img src={media(article.image)} alt="" loading={featured ? undefined : 'lazy'} fetchPriority={featured ? 'high' : undefined}/>
  </figure>
}

function media(value) { return value.startsWith('/') ? value : '/media/' + value }
function articleHref(article) { return '/blog/' + article.slug + '/' }
