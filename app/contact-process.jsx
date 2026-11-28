'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { contactSteps } from './template-seeds'



export function ContactProcess({ content }) {
  const steps = content?.steps || contactSteps.map(([heading, text]) => ({ heading, text }))
  const list = useRef(null)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: list, offset: ['start center', 'end center'] })

  useMotionValueEvent(scrollYProgress, 'change', progress => {
    setActive(Math.min(steps.length - 1, Math.floor(progress * steps.length)))
  })

  return <section className="wrap contact-process" aria-labelledby="contact-process-heading">
    <div className="contact-process-intro">
      <h2 id="contact-process-heading">{content?.heading || 'What happens next'}</h2>
    </div>
    <div className="contact-process-track">
      <motion.span className="contact-process-progress" style={{ scaleY: scrollYProgress }} aria-hidden="true"/>
      <ol ref={list}>
        {steps.map(({ heading, text }, index) => <li key={index} data-active={index === active}>
          <h3>{heading}</h3>
          <p>{text}</p>
        </li>)}
      </ol>
    </div>
  </section>
}
