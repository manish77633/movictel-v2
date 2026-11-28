'use client'

import { homeContent } from './home-content'
import { mediaUrl } from './media-source'
import { useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'

export function ClientLogoStrip({ headingId = 'clients-heading', className = '', title, logos }) {
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()
  return <section className={'logo-showcase ' + className} aria-labelledby={headingId}>
    <div className="client-heading client-strip-heading">
      <h2 id={headingId}>{title ?? homeContent.clients.heading}</h2>
      {!reduce && <button className="carousel-button" type="button" onClick={() => setPaused(value => !value)}
        aria-label={paused ? 'Play logo animation' : 'Pause logo animation'}>
        {paused ? <Play size={16}/> : <Pause size={16}/>}
      </button>}
    </div>
    <div className="client-strip" data-paused={paused}>
      <div className="client-track">
        {[false, true].map(copy => <ul className="client-logo-set" key={String(copy)} aria-hidden={copy || undefined}>
          {(logos ?? homeContent.clients.logos).map(({ name, image }, index) => <li key={index}><img src={mediaUrl(image)} alt={name} loading="lazy"/></li>)}
        </ul>)}
      </div>
    </div>
  </section>
}
