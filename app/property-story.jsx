'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const consultation = '/book-a-consultation/?service=real-estate-marketing'
const campaignSteps = [
  ['Discover the project', 'A location focused ad gives buyers a reason to explore the development.', 'service-social.webp', 'Campaign ad'],
  ['Compare the details', 'The project page brings floor plans, amenities and location together with a short enquiry form.', 'client-demo-web.jpg', 'Project landing page'],
  ['Confirm a visit', 'A WhatsApp follow-up shares available times and directions for the site visit.', 'work-campus-tour.webp', 'WhatsApp follow-up'],
]
const launchInputs = ['Project brochure or floor plans', 'Launch date and campaign timeline', 'Target buyers and priority locations', 'Current enquiry and follow-up process']
const technology = [
  { title: '360-Degree Video and Augmented Reality', text: 'Explore a sample flat before booking a visit.', image: 'property-cutout-0.webp' },
  { title: 'Geo-Fencing and Geo-Farming', text: 'Discover projects in the neighbourhoods you’re considering.', image: 'property-cutout-1.webp' },
  { title: 'Predictive Analytics and Machine Learning', text: 'Use local market trends to put property prices in context.', image: 'property-cutout-2.webp' },
  { title: 'Voice-Activated Devices', text: 'Ask a spoken question to find project details quickly.', image: 'property-cutout-3.webp' },
]
const chapters = [
  {
    name: 'Performance Marketing',
    title: 'Data-Driven Campaigns That Convert Leads Into Closures',
    intro: 'We combine performance analytics, smart targeting, and creative storytelling to turn every click into a qualified lead and every lead into a closure.',
    value: '65%', label: 'High-Quality Leads Increase',
    result: 'Achieved a 65% rise in high-quality leads while reducing acquisition cost by 30%, using AI-optimized targeting and retargeting campaigns.',
    image: 'contact-campaign-planning.webp',
  },
  {
    name: 'Lead Optimization',
    title: 'Crafting Brand Presence that Drives Conversions',
    intro: 'We help real estate brands build a powerful digital identity that attracts buyers, builds trust, and turns engagement into measurable sales.',
    value: '35%', label: 'Lead Quality Growth',
    result: 'Drove a 35% improvement in qualified leads through precision audience segmentation and creative ad storytelling.',
    image: 'client-demo-property.jpg',
  },
  {
    name: 'Brand Establishment',
    title: 'Enhance Market Value with Powerful Brand Positioning',
    intro: 'Build a strong digital identity that elevates your project’s perception, attracts premium buyers, and drives higher value in the market.',
    value: '15+', label: 'Resort Closures in 60 Days',
    result: 'Successfully launched a new brand identity that led to 15 resort closures within the first 60 days, setting a benchmark in luxury hospitality marketing.',
    image: 'industry-education.webp',
  },
  {
    name: 'Brand Transformation',
    title: 'Redefining Real Estate Identities for the Digital Era',
    intro: 'We help real estate developers build strong digital identities that attract buyers, build trust, and stand out in a competitive market.',
    value: '85+', label: 'Closures Achieved',
    result: 'Established a complete digital brand presence resulting in 85 property closures and a sustained flow of qualified leads month-over-month.',
    image: 'industry-property.webp',
  },
]

export function PropertyHero({ page, draft, bookingHref = consultation, anchor = '#property-strategy' }) {
  const image = !page.image || page.image === 'live-real-estate.webp' ? 'estate.jpg' : page.image
  return <section className="journal-intro journal-photo-hero" aria-labelledby="property-title">
    <div className="journal-hero-photo"><img src={image.startsWith('/') ? image : '/media/' + image} alt="" fetchPriority="high"/></div>
    <div className="wrap journal-photo-inner">
      <div className="journal-masthead-copy">
        {draft && <p role="status">Draft preview</p>}
        <h1 id="property-title">{page.title}</h1>
        <p>{page.intro}</p>
        <div className="journal-hero-actions">
          <Link className="button" href={bookingHref}>Book a consultation <ArrowUpRight size={17}/></Link>
          <a href={anchor}>Explore the service <ArrowDown size={17}/></a>
        </div>
      </div>
    </div>
  </section>
}

const mediaSrc = image => image.startsWith('/') ? image : '/media/' + image

function StrategyPhone({ topic }) {
  return <article className="property-phone">
      <div className="property-phone-screen">
        <span className="property-camera" aria-hidden="true"/>
        <div className="property-screen-copy">
          <h3>{topic.title}</h3>
          <p>{topic.text}</p>
        </div>
        <div className="property-phone-visual"><img src={mediaSrc(topic.image)} alt="" loading="lazy"/></div>
        <span className="property-home-indicator" aria-hidden="true"/>
      </div>
  </article>
}

export function CampaignResults({ items, title = 'Movictel Marketing Strategy for Clients' }) {
  const reduced = useReducedMotion()
  const track = useRef(null)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 76px', 'end end'] })
  const offsets = items.flatMap((_, index) => [index / items.length, (index + .5) / items.length])
  const positions = items.flatMap((_, index) => Array(2).fill(`${-100 * index / items.length}%`))
  const x = useTransform(scrollYProgress, offsets, positions)
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
        {chapter.image && <div className="property-result-photo"><img src={chapter.image.startsWith('/') ? chapter.image : '/media/' + chapter.image} alt="" loading="lazy"/></div>}
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

function CampaignPreview({ steps, title, label, intro, children }) {
  return <section className="wrap property-campaign-preview" aria-labelledby="property-campaign-title">
    <p className="property-phone-name">{label}</p>
    <h2 id="property-campaign-title">{title}</h2>
    {intro && <p className="property-preview-note">{intro}</p>}
    <ol className="property-campaign-steps">
      {steps.map(([title, description, image, channel]) => <li key={title}>
        <img src={mediaSrc(image)} alt="" loading="lazy"/>
        <div className="property-campaign-copy">
          <p className="property-phone-name">{channel}</p>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </li>)}
    </ol>
    {children}
  </section>
}

export function PropertyStory({
  topics = technology,
  topicsTitle = 'How technology changes the property search',
  topicsIntro,
  steps = campaignSteps,
  previewTitle = 'From the first ad to a booked site visit',
  previewLabel = 'Illustrative campaign',
  previewIntro,
  story = chapters,
  storyTitle,
  inputs = launchInputs,
  ctaTitle = 'Plan your launch',
  ctaText = 'Bring what you have to the first call so we can discuss your launch and where buyers need a clearer next step.',
  bookingHref = consultation,
  children,
} = {}) {
  return <>
    <section id="property-strategy" className="wrap property-strategy">
      <h2>{topicsTitle}</h2>
      {topicsIntro && <p className="property-strategy-intro">{topicsIntro}</p>}
      <div className="property-phones">
        {topics.map(topic => <StrategyPhone key={topic.title} topic={topic}/>)}
      </div>
    </section>
    <CampaignPreview steps={steps} title={previewTitle} label={previewLabel} intro={previewIntro}>{children}</CampaignPreview>
    <CampaignResults items={story} title={storyTitle}/>
    <section className="wrap property-story-cta" aria-labelledby="property-launch-title">
      <div>
        <h2 id="property-launch-title">{ctaTitle}</h2>
        <p>{ctaText}</p>
        <Link className="button" href={bookingHref}>Discuss your project <ArrowUpRight size={17}/></Link>
      </div>
      <ul>{inputs.map(input => <li key={input}>{input}</li>)}</ul>
    </section>
  </>
}
