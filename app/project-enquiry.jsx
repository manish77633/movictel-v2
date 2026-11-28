'use client'

import { startTransition, useActionState, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { submitProjectEnquiry } from './enquiry'
import { enquiryServices } from './service-menu'
import { enquiryContent } from './home-content'
import { SignalWaves } from './signal-waves'

export function ProjectEnquiry({ service = '', viaWhatsApp, contact = false, demo = false, draft = false, content = enquiryContent }) {
  const [result, submit, pending] = useActionState(submitProjectEnquiry, null)
  const dragStart = useRef(null)
  const suppressClick = useRef(false)
  const [offset, setOffset] = useState(0)

  function finishSwipe(event) {
    const start = dragStart.current
    if (start === null) return
    const distance = event.clientX - start
    const travel = event.currentTarget.clientWidth - 52
    dragStart.current = null
    setOffset(0)
    suppressClick.current = Math.abs(distance) > 8
    if (distance >= travel * .7) event.currentTarget.form.requestSubmit()
  }

  const subject = demo ? 'demo request' : 'enquiry'

  return <section className={contact ? 'project-enquiry project-enquiry-contact' : 'project-enquiry'}
    id={contact ? 'contact-enquiry' : 'enquiry'} aria-labelledby="project-enquiry-title">
    <SignalWaves/>
    <div className="wrap project-enquiry-grid">
      <div className="project-enquiry-copy">
        <h2 id="project-enquiry-title">{demo ? content.demoHeading : content.heading}</h2>
        <p>{demo ? content.demoText : content.text}</p>
        {contact && !demo && <ul className="contact-brief">
          {content.briefPoints.map((point, index) => <li key={index}>{point}</li>)}
        </ul>}
        {content.email && <a href={'mailto:' + content.email}>{content.email}</a>}
        {content.phone && <a href={'tel:' + content.phone.replace(/[^+0-9]/g, '')}>{content.phone}</a>}
        {draft && <p role="status">Draft preview</p>}
      </div>
      <form className="project-enquiry-form" aria-labelledby="project-enquiry-form-title" aria-describedby="project-enquiry-form-description" onSubmit={event => {
        event.preventDefault()
        if (pending || result?.saved) return
        const fields = new FormData(event.currentTarget)
        startTransition(() => submit(fields))
      }}>
        <div className="project-enquiry-form-header project-enquiry-wide">
          <h3 id="project-enquiry-form-title">{content.formHeading}</h3>
          <p id="project-enquiry-form-description">{content.formText}</p>
        </div>
        <label>{content.nameLabel}<input name="name" autoComplete="name" maxLength={120} required/></label>
        <label>{content.emailLabel}<input name="email" type="email" autoComplete="email" maxLength={254} required/></label>
        <label>{content.phoneLabel}<input name="phone" type="tel" autoComplete="tel" maxLength={30} required/></label>
        {demo ? <label>{content.serviceLabel}<input value="IVR" readOnly/><input name="service" type="hidden" value="ivr"/></label> : <label>{content.serviceLabel}
          <select name="service" defaultValue={enquiryServices.some(([, id]) => id === service) ? service : ''} required>
            <option value="" disabled>{content.servicePlaceholder}</option>
            {enquiryServices.map(([label, id]) => <option value={id} key={id}>{label}</option>)}
          </select>
        </label>}
        {demo && <>
          <input type="hidden" name="intent" value="ivr-demo"/>
          <label>{content.demoDateLabel}<input name="demoDate" type="date" required/></label>
          <label>{content.demoTimeLabel}<input name="demoTime" type="time" required/></label>
          <label className="project-enquiry-wide">{content.demoFormatLabel}
            <select name="demoFormat" defaultValue="Google Meet">
              <option>Google Meet</option>
              <option>Phone call</option>
            </select>
          </label>
        </>}
        <label className="project-enquiry-wide">{content.messageLabel}<textarea name="message" rows={4} maxLength={2000} required/></label>
        {viaWhatsApp && <p className="project-enquiry-note project-enquiry-wide">Review your details and send the {subject} in WhatsApp.</p>}
        {result?.error && <p role="alert" className="project-enquiry-wide">{result.error}</p>}
        {result?.saved && <p role="status" className="project-enquiry-wide">{demo ? content.demoSuccessText : content.successText}</p>}
        {result?.whatsapp && <a className="button project-enquiry-wide project-whatsapp-link" href={result.whatsapp}>Open WhatsApp to send your {subject}</a>}
        <button type="submit" className="project-swipe project-enquiry-wide" disabled={pending || result?.saved}
          style={{ '--swipe-offset': offset + 'px' }}
          onPointerDown={event => {
            if (!event.isPrimary || event.button !== 0) return
            dragStart.current = event.clientX
            suppressClick.current = false
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerMove={event => {
            if (dragStart.current !== null) setOffset(Math.max(0, Math.min(event.currentTarget.clientWidth - 52, event.clientX - dragStart.current)))
          }}
          onPointerUp={finishSwipe}
          onPointerCancel={() => { dragStart.current = null; setOffset(0) }}
          onLostPointerCapture={() => { dragStart.current = null; setOffset(0) }}
          onClick={event => {
            if (event.detail && suppressClick.current) event.preventDefault()
            suppressClick.current = false
          }}>
          <span className="project-swipe-thumb" aria-hidden="true"><ArrowRight size={21}/></span>
          {pending ? 'Preparing…' : result?.saved ? 'Request sent' : viaWhatsApp ? 'Swipe to prepare ' + subject : demo ? content.demoButtonLabel : content.buttonLabel}
        </button>
      </form>
    </div>
  </section>
}
