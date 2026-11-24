'use server'
import { redirect } from 'next/navigation'
import { db, hasContentStorage } from './store'

export async function submitEnquiry(form) {
  const returnTo = form.get('returnTo') === 'contact' ? '/contact/' : '/book-a-consultation/'
  const anchor = returnTo === '/contact/' ? '#contact-enquiry' : ''
  if (!hasContentStorage()) redirect(returnTo + anchor)
  const fields = ['name', 'email', 'service', 'message'].map(key => String(form.get(key) ?? '').trim())
  const phone = String(form.get('phone') ?? '').trim()
  const phoneDigits = phone.replace(/\D/g, '').length
  if ((phone && (phone.length > 30 || !/^[+\d() .-]+$/.test(phone) || phoneDigits < 7 || phoneDigits > 15)) ||
      fields.some((field, index) => !field || field.length > [120, 254, 80, 2000][index]) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields[1])) redirect(returnTo + '?invalid=1' + anchor)
  db().prepare('INSERT INTO leads(name,email,service,message,phone) VALUES (?,?,?,?,?)').run(...fields, phone || null)
  redirect(returnTo + '?sent=1' + anchor)
}
