import type { ReactNode } from 'react'

interface Props {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className = '' }: Props) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center ${className}`}>
      {icon && <div className="mb-4 text-white/30">{icon}</div>}
      <h3 className="heading-display text-2xl text-white">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-white/55">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
