import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

export const cookieName = 'movictel-admin'

export function sign(expiry) {
  const secret = process.env.MOVICTEL_ADMIN_SECRET
  return secret && secret.length >= 32 ? createHmac('sha256', secret).update(expiry).digest('hex') : ''
}

export function matches(a, b) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length > 0 && left.length === right.length && timingSafeEqual(left, right)
}

export async function hasAdminSession() {
  const value = (await cookies()).get(cookieName)?.value || ''
  const [expiry, signature] = value.split('.')
  return Number(expiry) > Date.now() && matches(signature || '', sign(expiry))
}
