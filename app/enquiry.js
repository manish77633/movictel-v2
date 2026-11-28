'use server'
import { db, hasContentStorage, publicEnquiryServices } from './store'
import nodemailer from 'nodemailer'

async function notifyEnquiry({ name, email, phone, service, details, demo }) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ENQUIRY_TO_EMAIL } = process.env
  if (![SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ENQUIRY_TO_EMAIL].some(Boolean)) return
  const port = Number(SMTP_PORT || 465)
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !ENQUIRY_TO_EMAIL || ![465, 587].includes(port)) {
    throw new Error('Invalid enquiry SMTP configuration')
  }
  const secure = port === 465
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure,
    requireTLS: !secure,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
  })
  await transport.sendMail({
    from: { name: 'Movictel', address: SMTP_USER },
    to: ENQUIRY_TO_EMAIL,
    replyTo: { name, address: email },
    subject: demo ? 'New Movictel IVR demo request' : 'New Movictel enquiry',
    text: ['Name: ' + name, 'Email: ' + email, 'Phone: ' + phone, 'Service: ' + service, '', details].join('\n'),
  })
}

export async function submitProjectEnquiry(_previous, form) {
  const name = String(form.get('name') ?? '').trim()
  const email = String(form.get('email') ?? '').trim()
  const phone = String(form.get('phone') ?? '').trim()
  const service = publicEnquiryServices().find(([, id]) => id === form.get('service'))?.[0]
  const message = String(form.get('message') ?? '').trim()
  const phoneDigits = phone.replace(/\D/g, '').length
  if (!name || name.length > 120 || !/^[^\s@<>,;:"\\]+@[^\s@<>,;:"\\]+\.[^\s@<>,;:"\\]+$/.test(email) || email.length > 254 ||
      !/^[+\d() .-]+$/.test(phone) || phone.length > 30 || phoneDigits < 7 || phoneDigits > 15 ||
      !service || !message || message.length > 2000) {
    return { error: 'Check your contact details, select a service and add a short message.' }
  }

  const demo = form.get('intent') === 'ivr-demo'
  let details = message
  if (demo) {
    const date = String(form.get('demoDate') ?? '')
    const time = String(form.get('demoTime') ?? '')
    const format = form.get('demoFormat')
    const day = new Date(date + 'T00:00:00Z')
    const requestedTime = Date.parse(date + 'T' + time + ':00+05:30')
    if (form.get('service') !== 'ivr' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(day.getTime()) ||
        day.toISOString().slice(0, 10) !== date || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time) ||
        !Number.isFinite(requestedTime) || requestedTime <= Date.now() || !['Google Meet', 'Phone call'].includes(format)) {
      return { error: 'Choose a future date and time in IST and a valid meeting format.' }
    }
    details = ['IVR demo request', 'Preferred date: ' + date, 'Preferred time: ' + time + ' IST', 'Meeting format: ' + format, '', message].join('\n')
  }

  if (!hasContentStorage()) {
    const brief = [demo ? 'Hi Movictel, I’d like to request an IVR demo.' : 'Hi Movictel, I’d like to discuss a project.',
      '', 'Name: ' + name, 'Email: ' + email, 'Phone: ' + phone, 'Service: ' + service, '', details].join('\n')
    return { whatsapp: 'https://wa.me/919001955232?text=' + encodeURIComponent(brief) }
  }

  try {
    db().prepare('INSERT INTO leads(name,email,service,message,phone) VALUES (?,?,?,?,?)').run(name, email, service, details, phone)
  } catch (error) {
    console.error('Could not save project enquiry', error)
    return { error: 'We couldn’t save your enquiry. Try again or call us using the number on this page.' }
  }

  try {
    await notifyEnquiry({ name, email, phone, service, details, demo })
  } catch (error) {
    console.error('Enquiry saved but email notification failed', error.code || error.message)
  }
  return { saved: true }
}
