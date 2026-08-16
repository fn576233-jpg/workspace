import { Link } from 'react-router-dom'
import { EmptyState } from '../components/EmptyState'
import { usePageMeta } from '../hooks/usePageMeta'
import { FilmIcon } from '../components/icons'

export function NotFound() {
  usePageMeta('Page not found — HERO REEL', 'This page doesn\u2019t exist in the HERO REEL universe.')

  return (
    <div className="mx-auto max-w-2xl px-4 py-24">
      <EmptyState
        icon={<FilmIcon className="h-14 w-14" />}
        title="404 — Lost in the multiverse"
        description="This page doesn't exist in any timeline. Let's get you back to the movies."
        action={
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/" className="btn-red px-6 py-2.5 text-sm">
              Back to home
            </Link>
            <Link to="/movies" className="btn-ghost px-6 py-2.5 text-sm">
              Browse movies
            </Link>
          </div>
        }
      />
    </div>
  )
}
