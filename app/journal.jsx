'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { LayoutSections, SectionButton, SectionFrame, SectionMedia } from './section-frame'
import { SectionHeading, SectionText } from './managed-sections'

export function JournalIndex({ page, layout, additional }) {
  const [topic, setTopic] = useState('')
  const reduced = useReducedMotion()
  const topics = [...new Set(page.articles.map(article => article.topic))]
  const entries = topic ? page.articles.filter(article => article.topic === topic) : page.articles
  const render = {
    hero: content => <section className="journal-intro journal-photo-hero" aria-labelledby="journal-title">
      {content.media && <motion.div className="journal-hero-photo" initial={reduced ? false : { scale: 1.035 }}
        animate={{ scale: 1 }} transition={{ duration: reduced ? 0 : .72, ease: 'easeOut' }}>
        <SectionMedia value={content.media} alt={content.imageAlt} priority background/>
      </motion.div>}
      <div className="wrap journal-photo-inner">
        <div className="journal-masthead-copy">
          <h1 id="journal-title">{content.heading}</h1><p>{content.text}</p>
          <div className="journal-hero-actions cms-buttons" data-position={content.buttonPosition}>
            <SectionButton button={content.featuredButton}><ArrowUpRight size={17}/></SectionButton>
            <SectionButton button={content.browseButton} className=""><ArrowDown size={17}/></SectionButton>
          </div>
        </div>
        {content.featuredButton.href && <Link className="journal-hero-credit" href={content.featuredButton.href}>
          <div><span>{content.featuredLabel}</span><p>{content.featuredHeading}</p></div><ArrowUpRight size={19} aria-hidden="true"/>
        </Link>}
      </div>
    </section>,
    articles: content => <div className="wrap journal-content"><section className="journal-library" id="articles" aria-labelledby="journal-library-heading">
      <h2 id="journal-library-heading">{content.heading}</h2>
      <div className="journal-filters" role="group" aria-label="Filter guides by topic">
        {['', ...topics].map(item => <button type="button" key={item} aria-pressed={item === topic} onClick={() => setTopic(item)}>{item || content.allTopicsLabel}</button>)}
      </div>
      <motion.div className="journal-entries" key={topic} initial={reduced ? false : { opacity: .7, y: 7 }}
        animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .2 }}>
        {entries.map(article => <ArticleTile article={article} key={article.slug}/>)}
      </motion.div>
    </section></div>,
  }
  return <main className="journal" id="home">
    <LayoutSections layout={layout} hiddenHeading={page.title} render={(id, content) => render[id](content)}/>
    {additional}
  </main>
}

export function JournalArticle({ page, article, related, layout }) {
  const body = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: body, offset: ['start .22', 'end .75'] })
  const { scrollY } = useScroll()
  const [activeSection, setActiveSection] = useState(0)
  useMotionValueEvent(scrollY, 'change', () => {
    if (!body.current) return
    const blocks = Array.from(body.current.querySelectorAll(':scope section[data-article-part]'))
    setActiveSection(Math.max(0, blocks.findLastIndex(section => section.getBoundingClientRect().top <= 160)))
  })
  const sections = page.sections.filter(section => section.visible !== false)
  const readTime = Math.max(1, Math.ceil([page.intro, ...sections.flatMap(section => [section.text, ...(section.points || [])])].join(' ').split(/\s+/).length / 210))
  const render = {
    hero: content => <div className="journal-article-lead">
      <header className="journal-article-header">
        <SectionButton button={content.backButton} className=""/>
        <p className="journal-topic">{content.label} · {readTime} min read</p>
        <h1>{content.heading}</h1><p>{content.text}</p>
      </header>
      {content.media && <motion.div className="journal-article-art"
        initial={reduced ? false : { y: 10, opacity: .88 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reduced ? 0 : .4, ease: 'easeOut' }}>
        <Cover article={{ ...article, image: content.media, imageAlt: content.imageAlt }} featured/>
      </motion.div>}
    </div>,
    body: content => <div className="journal-reading-layout">
      {sections.length > 1 && <nav aria-label={content.heading}><h2>{content.heading}</h2>
        <ol>{sections.map((section, index) => <li key={index}><a href={'#guide-' + (index + 1)} aria-current={index === activeSection ? 'location' : undefined}>{section.heading}</a></li>)}</ol>
      </nav>}
      <article ref={body} className="journal-prose">
        {sections.map((section, index) => <SectionFrame key={index} section={{ ...section, visible: true }}>
          <section id={'guide-' + (index + 1)} data-article-part>
            <SectionHeading section={section}/><SectionText section={section}/>
            <SectionMedia value={section.image} mime={section.mediaType} alt={section.imageAlt}/>
          </section>
        </SectionFrame>)}
      </article>
    </div>,
    'article-cta': content => <div className="cms-buttons journal-article-cta" data-position={content.buttonPosition}><SectionButton button={content.button}><ArrowUpRight size={16}/></SectionButton></div>,
    related: content => related.length > 0 && <section className="journal-library journal-related"><h2>{content.heading}</h2>
      <div className="journal-entries">{related.map(item => <ArticleTile article={item} key={item.slug}/>)}</div>
    </section>,
  }
  return <main className="journal journal-article" id="home">
    {!reduced && <motion.div className="journal-reading-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true"/>}
    <div className="wrap"><LayoutSections layout={layout} hiddenHeading={page.title} render={(id, content) => render[id](content)}/></div>
  </main>
}

export function JournalHighlights({ articles, content }) {
  return <section className="selected-work about-journal" aria-labelledby="about-journal-heading">
    <header><div><h2 id="about-journal-heading">{content.heading}</h2><p>{content.text}</p></div>
      <SectionButton button={content.button} className=""><ArrowUpRight size={16} aria-hidden="true"/></SectionButton>
    </header>
    <div className="journal-entries">{articles.map(article => <ArticleTile key={article.slug} article={article}/>)}</div>
  </section>
}

function ArticleTile({ article }) {
  return <article className="journal-entry"><Link href={'/blog/' + article.slug + '/'}>
    <Cover article={article} background/>
    <div className="journal-entry-copy"><p className="journal-topic">{article.topic}</p>
      <h3>{article.title} <ArrowUpRight className="journal-tile-arrow" size={18} aria-hidden="true"/></h3><p>{article.intro}</p>
    </div>
  </Link></article>
}

function Cover({ article, featured, background }) {
  return <figure className={'journal-cover' + (article.cutout ? ' journal-cover--cutout' : '')}>
    <SectionMedia value={article.image} mime={article.mediaType} alt={article.imageAlt} priority={featured} background={background}/>
  </figure>
}
