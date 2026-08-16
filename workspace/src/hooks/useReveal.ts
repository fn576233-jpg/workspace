import { useEffect, useRef } from 'react'

interface Options extends IntersectionObserverInit {
  disabled?: boolean
}

export function useReveal<T extends HTMLElement>(options: Options = {}) {
  const ref = useRef<T | null>(null)
  const { disabled = false, threshold = 0.15, rootMargin = '0px 0px -40px 0px' } = options

  useEffect(() => {
    const el = ref.current
    if (!el || disabled) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      el.classList.add('revealed')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold, rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [disabled, threshold, rootMargin])

  return ref
}
