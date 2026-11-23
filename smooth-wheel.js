import { useEffect } from 'react'

export function useSmoothWheel() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let target = window.scrollY
    let position = target
    let previousTime = 0

    function stop() {
      cancelAnimationFrame(frame)
      frame = 0
      previousTime = 0
    }

    function maximum() {
      return Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    }

    function tick(time) {
      const elapsed = previousTime ? Math.min(time - previousTime, 40) : 1000 / 60
      previousTime = time
      const bottom = maximum()
      target = Math.min(target, bottom)
      const distance = target - position
      if (Math.abs(distance) < .65) {
        window.scrollTo({ top: target, behavior: 'instant' })
        stop()
        return
      }
      const atEdge = target === 0 || target === bottom
      position += distance * (1 - Math.exp(-elapsed / (atEdge ? 155 : 105)))
      window.scrollTo({ top: position, behavior: 'instant' })
      frame = requestAnimationFrame(tick)
    }

    function onWheel(event) {
      if (reducedMotion.matches || event.ctrlKey || event.shiftKey ||
          !event.cancelable || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return

      for (let element = event.target; element instanceof Element && element !== document.body; element = element.parentElement) {
        if (element.scrollHeight > element.clientHeight &&
            /auto|scroll/.test(getComputedStyle(element).overflowY)) return
      }

      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1
      if (!frame) position = target = window.scrollY
      target = Math.min(maximum(), Math.max(0, target + event.deltaY * unit))
      if (!frame && Math.abs(target - position) < .65) return
      event.preventDefault()
      if (!frame) frame = requestAnimationFrame(tick)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('pointerdown', stop)
    window.addEventListener('keydown', stop)
    reducedMotion.addEventListener('change', stop)
    return () => {
      stop()
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('pointerdown', stop)
      window.removeEventListener('keydown', stop)
      reducedMotion.removeEventListener('change', stop)
    }
  }, [])
}
