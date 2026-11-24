'use client'

import { useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'

const clients = [
  ['Jaigyan Realty', 'jaigyan.png'], ['Shri Krishna Group', 'krishna.webp'],
  ['Sheetla Properties', 'sheetla.webp'], ['Suryansh Realty', 'suryansh.webp'],
  ['Vinnora Realty', 'vinnora.webp'], ['Royal Homes', 'royal.webp'],
  ['Times Estate', 'live-times-estate.webp'], ['LCF Estates', 'live-lcf-estates.webp'],
]

export function ClientLogoStrip({ headingId = 'clients-heading', className = '' }) {
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()
  return <section className={'logo-showcase ' + className} aria-labelledby={headingId}>
    <div className="client-heading client-strip-heading">
      <h2 id={headingId}>Businesses we work with</h2>
      {!reduce && <button className="carousel-button" type="button" onClick={() => setPaused(value => !value)}
        aria-label={paused ? 'Play logo animation' : 'Pause logo animation'}>
        {paused ? <Play size={16}/> : <Pause size={16}/>}
      </button>}
    </div>
    <div className="client-strip" data-paused={paused}>
      <div className="client-track">
        {[false, true].map(copy => <ul className="client-logo-set" key={String(copy)} aria-hidden={copy || undefined}>
          {clients.map(([name, image]) => <li key={name}><img src={'/media/' + image} alt={name} loading="lazy"/></li>)}
        </ul>)}
      </div>
    </div>
  </section>
}
