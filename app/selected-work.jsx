'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SectionMedia, SectionButton } from './section-frame'
import { work } from './template-seeds'



export function FounderFeature({ content }) {
  const section = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: section, offset: ['start 76px', 'end end'] })
  const scale = useTransform(scrollYProgress, [0, .75, 1], [.9, 1.23, 1.23])

  return <section className="founder-story" ref={section} aria-labelledby="founder-feature-heading">
    <div className="founder-story-stage">
      <motion.div className="founder-feature" style={{ scale: reduced ? 1 : scale }}>
        <h2 id="founder-feature-heading">{content.heading}</h2>
        <figure>
          <SectionMedia value={content.image} alt={content.imageAlt}/>
          <blockquote>{content.quote}</blockquote>
          <figcaption><strong>{content.name}</strong><span>{content.role}</span></figcaption>
        </figure>
      </motion.div>
    </div>
  </section>
}

export function SelectedWork({ content }) {
  return <section className="selected-work" aria-labelledby="selected-work-heading">
    <header><div><h2 id="selected-work-heading">{content.heading}</h2><p>{content.text}</p></div>
      <SectionButton button={content.button} className=""><ArrowUpRight size={16}/></SectionButton>
    </header>
    <div className="selected-work-grid">{(content.cards || work).map(({ title, type, image, imageAlt, description, href, cutout }, index) =>
      <Link className="selected-work-item" href={href || '#home'} key={index}>
        <div className={'selected-work-media' + (cutout ? ' selected-work-media--cutout' : '')}>
          <SectionMedia value={image} alt={imageAlt}/>
        </div>
        <p className="work-type">{type}</p>
        <h3>{title} <ArrowUpRight size={18} aria-hidden="true"/></h3><p>{description}</p>
      </Link>)}</div>
  </section>
}
