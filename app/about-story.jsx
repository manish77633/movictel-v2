'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const chapters = [
  {
    phase: 'Before launch', title: 'Show buyers what they’ll visit.',
    image: 'story-property.webp', alt: 'Architectural model of a residential development',
    text: 'Turn approved plans and property details into a first look buyers can understand. Show the homes, the location and how to arrange a viewing.',
    deliverables: ['Property photography and walkthroughs', 'Project landing page with floor plans'],
  },
  {
    phase: 'During the campaign', title: 'Bring the right buyers to the project.',
    image: 'story-campaign.webp', alt: 'Two phones displaying residential property campaign imagery',
    text: 'Use reels and location guides to introduce the project. Send interested buyers from Meta and Google campaigns to a page that answers their questions and captures enquiries.',
    deliverables: ['Reels, social posts and paid ad creative', 'Enquiry forms with campaign source tracking'],
  },
  {
    phase: 'After the enquiry', title: 'Turn enquiries into booked visits.',
    image: 'story-visit.webp', alt: 'Phone with a booking calendar beside a house key',
    text: 'Route new enquiries to the sales team, confirm the date and share directions on WhatsApp. Track which enquiries turn into confirmed and attended visits.',
    deliverables: ['Sales callback and WhatsApp confirmation', 'Visit reminders and follow-up'],
  },
]

export function AboutFilm({ title, intro, label = 'About Movictel', heading: Title = 'h1' }) {
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
    if (showing && !reduced) player.play().catch(() => {})
    else player.pause()
  }, [showing, reduced])

  return <section className="about-film" ref={scene} aria-labelledby="about-film-title">
    <div className="about-film-stage">
      <motion.div className="about-film-picture" style={{ opacity: film, clipPath: crop }} aria-hidden="true">
        <video ref={video} muted loop playsInline preload="metadata" poster="/media/estate-hero.jpg" src="/media/estate-hero.mp4"/>
      </motion.div>
      <motion.div className="about-film-title" style={{ scale: size, opacity: heading }}>
        <p>{label}</p>
        <Title id="about-film-title">{title}</Title>
      </motion.div>
      <motion.p className="about-film-caption" style={{ opacity: caption }}>{intro}</motion.p>
    </div>
  </section>
}

export function AboutGallery() {
  const gallery = useRef(null)
  const { scrollYProgress } = useScroll({ target: gallery, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, .19, .38, .62, .81, 1], ['0%', '0%', '-33.3333%', '-33.3333%', '-66.6667%', '-66.6667%'])
  return <section className="about-chapters" ref={gallery} aria-labelledby="about-chapters-title">
    <div className="about-chapters-stage">
      <div className="wrap about-chapters-header">
        <h2 id="about-chapters-title">From launch to site visit</h2>
        <motion.span className="about-chapters-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true"/>
      </div>
      <motion.ol className="about-chapters-track" style={{ x }} tabIndex={0} aria-label="Real estate campaign stages">
        {chapters.map(({ phase, title, image, alt, text, deliverables }, index) => <li className="about-chapter" key={title}>
          <article className="wrap about-chapter-layout">
            <div className="about-chapter-copy">
              <p className="about-chapter-phase"><span aria-hidden="true">0{index + 1}</span>{phase}</p>
              <h3>{title}</h3><p>{text}</p>
              <ul className="about-chapter-deliverables">{deliverables.map(item => <li key={item}>{item}</li>)}</ul>
            </div>
            <figure className="about-chapter-visual"><img src={'/media/' + image} alt={alt} loading="lazy"/></figure>
          </article>
        </li>)}
      </motion.ol>
    </div>
  </section>
}
