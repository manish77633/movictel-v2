'use client'
import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

export function Scenario({ scenario }) {
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion()
  return <section className="scenario">
    <div><p className="editorial-kicker">Interactive example</p><h2>{scenario.title}</h2>
      <div className="scenario-actions">{scenario.actions.map(([label], index) => <button type="button" aria-pressed={active === index} key={label} onClick={() => setActive(index)}>{label}</button>)}</div>
    </div>
    <div className="scenario-screen" aria-live="polite">
      <p>{scenario.lead}</p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p key={active} initial={reduce ? false : { opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0 }} transition={{ duration: reduce ? 0 : .14 }}>
          {scenario.actions[active][1]}
        </motion.p>
      </AnimatePresence>
    </div>
  </section>
}
