'use client'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll } from 'framer-motion'

export function ServiceWorkflow({ items }) {
  const track = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: track, offset: ['start .82', 'end .43'] })

  return <div className="service-workflow-track" ref={track}>
    <motion.span className="service-workflow-line" aria-hidden="true" style={{ scaleY: reduced ? 1 : scrollYProgress }}/>
    <ol className="service-workflow-list">
    {items.map(([title, description], index) => <motion.li className="service-workflow-step" key={title}>
      <motion.span className="workflow-marker" aria-hidden="true"
        initial={false} whileInView={reduced ? undefined : { backgroundColor: '#264bd0', color: '#fff' }}
        viewport={{ once: true, amount: .55 }} transition={{ duration: .24 }}>{index + 1}</motion.span>
      <div><h3>{title}</h3><p>{description}</p></div>
    </motion.li>)}
    </ol>
  </div>
}
