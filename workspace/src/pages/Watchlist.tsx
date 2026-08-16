import { Link } from 'react-router-dom'
import { useWatchlist } from '../lib/store'
import { MOVIES } from '../data'
import { MovieCard } from '../components/MovieCard'
import { SectionHeader } from '../components/SectionHeader'
import { Reveal } from '../components/Reveal'
import { EmptyState } from '../components/EmptyState'
import { usePageMeta } from '../hooks/usePageMeta'
import { Bookmark, FilmIcon, TrashIcon } from '../components/icons'

export function Watchlist() {
  usePageMeta('Watchlist — HERO REEL', 'Your saved Marvel movies, ready to watch.')
  const ids = useWatchlist((s) => s.ids)
  const clear = useWatchlist((s) => s.clear)

  const map = new Map(MOVIES.map((m) => [m.id, m]))
  const movies = ids.map((id) => map.get(id)).filter((m): m is NonNullable<typeof m> => Boolean(m))

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="Saved for later"
          title="Your Watchlist"
          description={movies.length > 0 ? `${movies.length} ${movies.length === 1 ? 'movie' : 'movies'} saved.` : 'Build your personal movie universe.'}
        >
          {movies.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-sm text-white/60 transition hover:border-red-500/50 hover:text-red-400"
            >
              <TrashIcon className="h-4 w-4" /> Clear all
            </button>
          )}
        </SectionHeader>
      </Reveal>

      {movies.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
          {movies.map((m, i) => (
            <Reveal key={m.id} delay={(i % 5) * 50}>
              <MovieCard movie={m} eager={i < 4} />
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal>
          <EmptyState
            icon={<Bookmark className="h-14 w-14" />}
            title="Your watchlist is empty"
            description="Save movies you want to remember — they'll be waiting here on this device, even after you close the tab."
            action={
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/movies" className="btn-red px-6 py-2.5 text-sm">
                  <FilmIcon className="h-4 w-4" /> Browse the library
                </Link>
                <Link to="/" className="btn-ghost px-6 py-2.5 text-sm">
                  Back to home
                </Link>
              </div>
            }
          />
        </Reveal>
      )}
    </div>
  )
}
