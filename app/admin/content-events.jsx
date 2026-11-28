'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { pagePath } from '../seo'

const channelName = 'movictel-content'

export function announceContentChange(slug, published) {
  if (typeof BroadcastChannel === 'undefined') return
  const channel = new BroadcastChannel(channelName)
  channel.postMessage({ slug, published })
  channel.close()
}

export function ContentEvents() {
  const router = useRouter()
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return
    const channel = new BroadcastChannel(channelName)
    channel.onmessage = ({ data }) => {
      if (!data || (data.slug !== null && typeof data.slug !== 'string')) return
      const path = window.location.pathname.replace(/\/$/, '') || '/'
      if (path === '/admin') return
      const draft = new URLSearchParams(window.location.search).get('preview') === 'draft'
      const changed = data.slug === null ? null : pagePath(data.slug).replace(/\/$/, '') || '/'
      const blogChanged = data.slug?.startsWith('blog/') && ['/blog', '/about'].includes(path)
      const serviceChanged = data.slug?.startsWith('services/') && path === '/services'
      if ((data.published || draft) && (changed === null || changed === path || blogChanged || serviceChanged)) router.refresh()
    }
    return () => channel.close()
  }, [router])
  return null
}
