import { useCallback, useRef } from 'react'
import type { ReactNode } from 'react'
import { ArrowLeft, ArrowRight } from './icons'

interface Props {
  children: ReactNode
  label: string
  className?: string
  itemClassName?: string
}

export function Carousel({ children, label, className = '', itemClassName = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const scrollBy = useCallback((dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 320), behavior: 'smooth' })
  }, [])

  return (
    <div className="group/carousel relative">
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={`no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-1 py-2 pb-4 ${className}`}
      >
        {Array.isArray(children)
          ? children.map((c, i) => (
              <div key={i} className={`shrink-0 snap-start ${itemClassName}`}>
                {c}
              </div>
            ))
          : children}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-10 bg-gradient-to-r from-[var(--t-bg-to)] to-transparent opacity-70 transition-opacity group-hover/carousel:opacity-100 md:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-10 bg-gradient-to-l from-[var(--t-bg-to)] to-transparent opacity-70 transition-opacity group-hover/carousel:opacity-100 md:block" />

      <div className="absolute -top-3 right-0 z-20 hidden gap-2 md:flex">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label={`Scroll ${label} backward`}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur transition hover:border-white/40 hover:bg-black/70"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label={`Scroll ${label} forward`}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur transition hover:border-white/40 hover:bg-black/70"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
