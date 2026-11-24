'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from './site-chrome'

const work = [
  { title: 'On location for a property launch', type: 'Property marketing', image: 'work-on-location.webp', description: 'See how a project film, a focused landing page and visit follow-up can work together.', href: '/portfolio/residential-campaign/' },
  { title: 'Give families a reason to book a school tour', type: 'Admissions marketing', image: 'work-campus-tour.webp', description: 'A campaign approach built around campus films, local search and admissions enquiries.', href: '/#education' },
  { title: 'One shoot, three social formats', type: 'Content production', image: 'story-campaign.webp', cutout: true, description: 'Use one shoot for a short walkthrough, neighbourhood clips and launch creative.', href: '/blog/social-content-for-property/' },
  { title: 'From WhatsApp enquiry to confirmed visit', type: 'Business messaging', image: 'service-whatsapp.webp', cutout: true, description: 'An example of how WhatsApp can confirm a visit, share directions and hand off questions to sales.', href: '/services/whatsapp-business-api/' },
]

export function FounderFeature() {
  const section = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: section, offset: ['start .82', 'end end'] })
  const scale = useTransform(scrollYProgress, [0, .20, .9], [.92, 1, 1.19])

  return <section className="founder-story" ref={section} aria-labelledby="founder-feature-heading">
    <div className="founder-story-stage">
    <div className="founder-feature">
    <Reveal className="founder-feature-copy">
      <h2 id="founder-feature-heading">Meet the founder</h2>
      <figure>
        <blockquote>“Hi, I am Rahul Sharma, a digital marketer with more than 10 years of experience in lifting and helping brands grow online.”</blockquote>
        <figcaption><strong>Rahul Sharma</strong><span>Founder &amp; CEO, Movictel</span></figcaption>
      </figure>
    </Reveal>
    <motion.img style={{ scale: reduced ? 1 : scale }} src="/media/live-founder.webp" width={2048} height={1556}
      alt="Rahul Sharma, founder and CEO of Movictel" loading="lazy"/>
    </div></div>
  </section>
}

export function SelectedWork() {
  const reduced = useReducedMotion()
  return <section className="selected-work" aria-labelledby="selected-work-heading">
    <header><div><h2 id="selected-work-heading">What we create for campaigns</h2><p>Project shoots, admissions creative and the follow-up that turns interest into a conversation.</p></div>
      <a href="https://www.instagram.com/movictel/">See posts and reels on Instagram <ArrowUpRight size={16}/></a>
    </header>
    <div className="selected-work-grid">{work.map(({ title, type, image, description, href, cutout }) =>
      <Link className="selected-work-item" href={href} key={title}>
        <div className={'selected-work-media' + (cutout ? ' selected-work-media--cutout' : '')}>
          <motion.img src={'/media/' + image} alt="" loading="lazy"
            initial={reduced ? false : { scale: 1.055 }}
            whileInView={reduced ? undefined : { scale: 1 }}
            viewport={{ once: true, amount: .3 }} transition={{ duration: .58, ease: 'easeOut' }}/>
        </div>
        <p className="work-type">{type}</p>
        <h3>{title} <ArrowUpRight size={18} aria-hidden="true"/></h3><p>{description}</p>
      </Link>)}</div>
  </section>
}
