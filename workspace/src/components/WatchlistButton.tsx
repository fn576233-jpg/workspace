import { useWatchlist } from '../lib/store'
import { Bookmark, BookmarkFilled } from './icons'

interface Props {
  id: string
  label?: string
  className?: string
  variant?: 'icon' | 'pill'
}

export function WatchlistButton({ id, label, className = '', variant = 'icon' }: Props) {
  const inList = useWatchlist((s) => s.ids.includes(id))
  const toggle = useWatchlist((s) => s.toggle)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(id)
  }

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={inList}
        className={`btn-red cursor-pointer px-4 py-2.5 text-sm ${className}`}
      >
        {inList ? (
          <>
            <BookmarkFilled className="h-4 w-4" /> In Watchlist
          </>
        ) : (
          <>
            <Bookmark className="h-4 w-4" /> Add to Watchlist
          </>
        )}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={inList}
      aria-label={label ?? (inList ? 'Remove from watchlist' : 'Add to watchlist')}
      title={label}
      className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/40 text-white backdrop-blur transition hover:border-white/40 hover:bg-black/60 ${className}`}
    >
      {inList ? <BookmarkFilled className="h-4 w-4 text-[var(--t-primary)]" /> : <Bookmark className="h-4 w-4" />}
    </button>
  )
}
