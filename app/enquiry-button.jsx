'use client'

import { useFormStatus } from 'react-dom'
import { ArrowUpRight } from 'lucide-react'

export function EnquiryButton() {
  const { pending } = useFormStatus()
  return <button className="button" type="submit" disabled={pending}>
    {pending ? 'Sending…' : 'Send enquiry'} <ArrowUpRight size={16} aria-hidden="true"/>
  </button>
}
