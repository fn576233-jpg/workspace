import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { ChevronRight } from './icons'

interface Props {
  eyebrow?: string
  title: string
  description?: string
  linkTo?: string
  linkLabel?: string
  children?: ReactNode
}

export function SectionHeader({ eyebrow, title, description, linkTo, linkLabel = 'View all', children }: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--t-primary)]">{eyebrow}</p>
        )}
        <h2 className="heading-display text-3xl text-white sm:text-4xl">{title}</h2>
        {description && <p className="mt-2 max-w-xl text-sm text-white/60">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        {children}
        {linkTo && (
          <Link
            to={linkTo}
            className="inline-flex items-center gap-1 text-sm font-semibold text-white/70 transition-colors hover:text-[var(--t-glow)]"
          >
            {linkLabel}
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  )
}
