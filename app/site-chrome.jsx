'use client'
import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Header, Footer } from './home'

export function SiteChrome({ children, header, footer }) {
  return <><Header config={header}/>{children}<Footer config={footer}/></>
}

export function Reveal({ children, className, style }) {
  const reduce = useReducedMotion()
  return <motion.div className={className} style={style} initial={reduce ? false : { y: 18 }}
    whileInView={reduce ? undefined : { y: 0 }}
    viewport={{ once: true, amount: .16 }} transition={{ duration: .45, ease: 'easeOut' }}>
    {children}
  </motion.div>
}


export function FlowPreview({ steps }) {
  const [current, setCurrent] = useState(0)
  return <ol className="interior-steps" aria-label="Example workflow">
    {steps.map((step, index) => <li key={index}>
      <button type="button" aria-pressed={current === index} onClick={() => setCurrent(index)}>
        <span aria-hidden="true">{index + 1}</span>{step}
      </button>
    </li>)}
  </ol>
}
