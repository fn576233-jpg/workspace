import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { searchMovies } from '../lib/search'
import { useRecentSearches } from '../lib/store'
import { MOVIES, TRENDING_IDS } from '../data'
import type { Movie } from '../types'
import { MovieGrid } from '../components/MovieGrid'
import { SkeletonMovieGrid } from '../components/Skeletons'
import { SectionHeader } from '../components/SectionHeader'
import { EmptyState } from '../components/EmptyState'
import { Reveal } from '../components/Reveal'
import { usePageMeta } from '../hooks/usePageMeta'
import { Search, XIcon, FilmIcon, SparklesIcon, Clock } from '../components/icons'

const POPULAR_QUERIES = ['Spider-Man', 'Wolverine', 'Iron Man', 'Avengers', 'Guardians', 'Black Panther', 'Thor', 'Deadpool', 'Blade', 'Venom']

export function SearchPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const [loading, setLoading] = useState(false)
  const addRecent = useRecentSearches((s) => s.add)
  const recent = useRecentSearches((s) => s.queries)
  const clearRecent = useRecentSearches((s) => s.clear)

  usePageMeta(
    q ? `Search: ${q} — HERO REEL` : 'Search — HERO REEL',
    'Search every Marvel movie by title, character, actor, franchise, or genre.',
  )

  useEffect(() => {
    if (!q.trim()) return
    addRecent(q.trim())
  }, [q, addRecent])

  useEffect(() => {
    setLoading(true)
    const t = window.setTimeout(() => setLoading(false), 260)
    return () => window.clearTimeout(t)
  }, [q])

  const results = q.trim() ? searchMovies(q, 60) : []

  const trending = TRENDING_IDS.map((id) => MOVIES.find((m) => m.id === id)).filter(
    (m): m is Movie => m !== undefined && m.status === 'released',
  )

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6">
      <Reveal>
        <SectionHeader eyebrow="Find your next favorite" title={q.trim() ? `Results for “${q.trim()}”` : 'Search the Library'} description={q.trim() ? `${results.length} matching movies` : 'Search by title, character, actor, franchise, or genre.'} />
      </Reveal>

      <Reveal delay={60}>
        <form
          className="relative mb-8 max-w-2xl"
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            const v = new FormData(e.currentTarget).get('q') as string
            setParams(v.trim() ? { q: v.trim() } : {})
          }}
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search movies, characters, actors…"
            aria-label="Search the library"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-12 pr-12 text-white placeholder:text-white/40 backdrop-blur transition focus:border-[var(--t-primary)] focus:outline-none"
          />
          {q && (
            <button
              type="button"
              onClick={() => setParams({})}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-white/50 transition hover:text-white"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </form>
      </Reveal>

      {loading ? (
        <SkeletonMovieGrid count={12} />
      ) : q.trim() ? (
        results.length > 0 ? (
          <MovieGrid movies={results} />
        ) : (
          <EmptyState
            icon={<FilmIcon className="h-12 w-12" />}
            title={`No matches for “${q.trim()}”`}
            description="Check the spelling, or try searching by a character, actor, franchise, or genre instead."
            action={
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/movies" className="btn-red px-6 py-2.5 text-sm">
                  Browse the full library
                </Link>
              </div>
            }
          />
        )
      ) : (
        <div className="space-y-12">
          {recent.length > 0 && (
            <section aria-label="Recent searches">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/50">
                  <Clock className="h-4 w-4" /> Recent searches
                </h2>
                <button type="button" onClick={clearRecent} className="cursor-pointer text-xs text-white/40 transition hover:text-white">
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setParams({ q: r })}
                    className="cursor-pointer rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/80 transition hover:border-white/35 hover:text-white"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </section>
          )}

          <section aria-label="Popular searches">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/50">
              <SparklesIcon className="h-4 w-4 text-[var(--t-primary)]" /> Popular searches
            </h2>
            <div className="flex flex-wrap gap-2">
              {POPULAR_QUERIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setParams({ q: p })}
                  className="cursor-pointer rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/80 transition hover:border-white/35 hover:text-white"
                >
                  {p}
                </button>
              ))}
            </div>
          </section>

          <section aria-label="Trending">
            <h2 className="heading-display mb-4 text-3xl text-white">Trending now</h2>
            <MovieGrid movies={trending} />
          </section>
        </div>
      )}
    </div>
  )
}
