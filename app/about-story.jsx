'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { mediaUrl, isVideo } from './media-source'
import { SectionMedia } from './section-frame'
import { aboutChapters } from './template-seeds'



export function AboutFilm({ title, intro, label = 'About Movictel', heading: Title = 'h1', content }) {
  const source = content?.media ?? 'estate-hero.mp4'
  const poster = content?.poster ?? 'estate-hero.jpg'
  const scene = useRef(null)
  const video = useRef(null)
  const reduced = useReducedMotion()
  const showing = useInView(scene, { amount: 'some' })
  const { scrollYProgress } = useScroll({ target: scene, offset: ['start start', 'end end'] })
  const size = useTransform(scrollYProgress, [0, .3, .48], [1, 1.7, 1.95])
  const heading = useTransform(scrollYProgress, [.22, .53], [1, 0])
  const film = useTransform(scrollYProgress, [.11, .49], [0, 1])
  const crop = useTransform(scrollYProgress, [.1, .55], ['inset(24% 23% round 24px)', 'inset(0% 0% round 0px)'])
  const caption = useTransform(scrollYProgress, [.53, .75], [0, 1])

  useEffect(() => {
    const player = video.current
    if (!player) return
    if (showing && !reduced) player.play().catch(() => {})
    else player.pause()
  }, [showing, reduced])

  return <section className="about-film" ref={scene} aria-labelledby="about-film-title">
    <div className="about-film-stage">
      <motion.div className="about-film-picture" style={{ opacity: film, clipPath: crop }} aria-hidden="true">
        {isVideo(source)
          ? <video ref={video} muted loop playsInline preload="metadata" poster={mediaUrl(poster)} src={mediaUrl(source)}/>
          : <SectionMedia value={source} alt={content?.imageAlt}/>}
      </motion.div>
      <motion.div className="about-film-title" style={{ scale: size, opacity: heading }}>
        <p>{content?.label ?? label}</p>
        <Title id="about-film-title">{content?.heading ?? title}</Title>
      </motion.div>
      <motion.p className="about-film-caption" style={{ opacity: caption }}>{content?.text ?? intro}</motion.p>
    </div>
  </section>
}

export function AboutGallery({ content }) {
  const gallery = useRef(null)
  const { scrollYProgress } = useScroll({ target: gallery, offset: ['start start', 'end end'] })
  const stages = content?.stages || aboutChapters
  const points = stages.length ? stages.flatMap((_, index) => [index / stages.length, (index + .6) / stages.length]) : [0, 1]
  const offsets = stages.length ? stages.flatMap((_, index) => Array(2).fill((-100 * index / stages.length) + '%')) : ['0%', '0%']
  const x = useTransform(scrollYProgress, points, offsets)
  if (!stages.length) return null
  return <section className="about-chapters" style={{ "--chapter-count": stages.length }} ref={gallery} aria-labelledby="about-chapters-title">
    <div className="about-chapters-stage">
      <div className="wrap about-chapters-header">
        <h2 id="about-chapters-title">{content?.heading ?? 'From launch to site visit'}</h2>
        <motion.span className="about-chapters-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true"/>
      </div>
      <motion.ol className="about-chapters-track" style={{ x }} tabIndex={0} aria-label="Real estate campaign stages">
        {stages.map(({ phase, title, image, alt, text, deliverables }, index) => <li className="about-chapter" key={index}>
          <article className="wrap about-chapter-layout">
            <div className="about-chapter-copy">
              <p className="about-chapter-phase"><span aria-hidden="true">0{index + 1}</span>{phase}</p>
              <h3>{title}</h3><p>{text}</p>
              <ul className="about-chapter-deliverables">{deliverables.map(item => <li key={item}>{item}</li>)}</ul>
            </div>
            <figure className="about-chapter-visual"><SectionMedia value={image} alt={alt}/></figure>
          </article>
        </li>)}
      </motion.ol>
    </div>
  </section>
}
