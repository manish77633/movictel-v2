'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function StudioLink({ href, eager = false, ...props }) {
  const router = useRouter()
  const warm = () => { if (!eager) router.prefetch(href) }
  return <Link {...props} href={href} prefetch={eager} onMouseEnter={warm} onFocus={warm} onPointerDown={warm}/>
}

