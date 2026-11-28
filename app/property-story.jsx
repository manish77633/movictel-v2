'use client'

import { useRef } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { SectionMedia, SectionButton } from './section-frame'

export function PropertyHero({ content, draft }) {
  return <section className="journal-intro journal-photo-hero" aria-labelledby="property-title">
    {content.media && <div className="journal-hero-photo">
      <SectionMedia value={content.media} alt={content.imageAlt} priority background/>
    </div>}
    <div className="wrap journal-photo-inner">
      <div className="journal-masthead-copy">
        {draft && <p role="status">Draft preview</p>}
        <h1 id="property-title">{content.heading}</h1>
        <p>{content.text}</p>
        <div className="journal-hero-actions cms-buttons" data-position={content.buttonPosition}>
          <SectionButton button={content.primaryButton}><ArrowUpRight size={17}/></SectionButton>
          <SectionButton button={content.secondaryButton} className=""><ArrowDown size={17}/></SectionButton>
        </div>
      </div>
    </div>
  </section>
}

function StrategyPhone({ topic }) {
  return <article className="property-phone">
      <div className="property-phone-screen">
        <span className="property-camera" aria-hidden="true"/>
        <div className="property-screen-copy">
          <h3>{topic.title}</h3>
          <p>{topic.text}</p>
        </div>
        <div className="property-phone-visual"><SectionMedia value={topic.image} alt={topic.imageAlt}/></div>
        <span className="property-home-indicator" aria-hidden="true"/>
      </div>
  </article>
}

export function CampaignResults({ items, title = 'How we run a property campaign' }) {
  const reduced = useReducedMotion()
  const track = useRef(null)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 76px', 'end end'] })
  const offsets = items.length ? items.flatMap((_, index) => [index / items.length, (index + .5) / items.length]) : [0, 1]
  const positions = items.length ? items.flatMap((_, index) => Array(2).fill(`${-100 * index / items.length}%`)) : ['0%', '0%']
  const x = useTransform(scrollYProgress, offsets, positions)
  if (!items.length) return null
  return <section className="property-results property-track" style={{ '--story-count': items.length }} ref={track} aria-labelledby="property-results-title">
    <div className="property-stage">
      <div className="wrap property-story-heading">
        <h2 id="property-results-title">{title}</h2>
        <motion.div className="property-story-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true"/>
      </div>
    <motion.div className="property-chapters" style={reduced ? undefined : { x }}>
      {items.map((chapter, index) => <div className="wrap property-result-slide" key={chapter.title}>
      <motion.article className="property-result-card"
        initial={reduced ? false : { opacity: .5, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: .2 }} transition={{ duration: .55, ease: 'easeOut' }}>
        {chapter.image && <div className="property-result-photo"><SectionMedia value={chapter.image} alt={chapter.imageAlt}/></div>}
        <div className="property-result-copy">
          <p className="property-chapter-index">0{index + 1} / 0{items.length}</p>
          <p className="property-phone-name">{chapter.name}</p>
          {chapter.value && <div className="property-result-metric"><strong>{chapter.value}</strong><span>{chapter.label}</span></div>}
          <h3>{chapter.title}</h3>
          <p>{chapter.result}</p>
          {chapter.intro && <p>{chapter.intro}</p>}
        </div>
      </motion.article></div>)}
    </motion.div>
    </div>
  </section>
}

export function CampaignPreview({ content, children }) {
  return <section className="wrap property-campaign-preview" aria-labelledby="property-campaign-title">
    <p className="property-phone-name">{content.label}</p>
    <h2 id="property-campaign-title">{content.heading}</h2>
    {content.text && <p className="property-preview-note">{content.text}</p>}
    <ol className="property-campaign-steps">
      {content.steps.map(({ heading, text, image, imageAlt, channel }, index) => <li key={index}>
        <SectionMedia value={image} alt={imageAlt}/>
        <div className="property-campaign-copy">
          <p className="property-phone-name">{channel}</p><h3>{heading}</h3><p>{text}</p>
        </div>
      </li>)}
    </ol>
    {children}
  </section>
}

export function CampaignOverview({ content }) {
  return <section id="property-strategy" className="wrap property-strategy">
    <h2>{content.heading}</h2>
    {content.text && <p className="property-strategy-intro">{content.text}</p>}
    <div className="property-phones">{content.topics.map((topic, index) => <StrategyPhone key={index} topic={topic}/>)}</div>
  </section>
}

export function ProjectBrief({ content }) {
  return <section className="wrap property-story-cta" aria-labelledby="property-launch-title">
    <div>
      <h2 id="property-launch-title">{content.heading}</h2><p>{content.text}</p>
      <div className="cms-buttons" data-position={content.buttonPosition}><SectionButton button={content.button}><ArrowUpRight size={17}/></SectionButton></div>
    </div>
    <ul>{content.points.map((input, index) => <li key={index}>{input}</li>)}</ul>
  </section>
}
