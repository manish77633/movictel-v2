'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export function PublicRouteScroll() {
  const pathname = usePathname()
  const previous = useRef(pathname)
  useEffect(() => {
    if (previous.current === pathname) return
    previous.current = pathname
    if (!pathname.startsWith('/admin') && !window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname])
  return null
}
