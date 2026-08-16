import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { searchMovies } from '../lib/search'
import { useRecentSearches } from '../lib/store'
import { MOVIES, TRENDING_IDS } from '../data'
import { MoviePoster } from './MoviePoster'
import { Star, Search, XIcon, Clock } from './icons'
import { formatRuntime } from '../lib/format'

const POPULAR_QUERIES = ['Spider-Man', 'Wolverine', 'Iron Man', 'Guardians', 'Avengers', 'Black Panther', 'Thor', 'Deadpool', 'X-Men', 'Venom']

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const recent = useRecentSearches((s) => s.queries)
  const addRecent = useRecentSearches((s) => s.add)
  const clearRecent = useRecentSearches((s) => s.clear)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const results = useMemo(() => searchMovies(query, 8), [query])

  const popularTitles = useMemo(() => {
    const map = new Map(MOVIES.map((m) => [m.id, m]))
    return TRENDING_IDS.slice(0, 8).map((id) => map.get(id)).filter(Boolean)
  }, [])

  const goToSearch = (q: string) => {
    const trimmed = q.trim()
    if (!trimmed) return
    addRecent(trimmed)
    onClose()
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  const goToMovie = (id: string, title: string) => {
    addRecent(title)
    onClose()
    navigate(`/movie/${id}`)
  }

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/70 backdrop-blur-md animate-fade-in" role="dialog" aria-modal="true" aria-label="Search movies">
      <div className="mx-auto min-h-full w-full max-w-3xl px-4 py-16 sm:py-24">
        <div className="glass-strong overflow-hidden rounded-3xl shadow-2xl">
          <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
            <Search className="h-5 w-5 shrink-0 text-[var(--t-primary)]" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') goToSearch(query)
              }}
              placeholder="Search by title, character, actor, franchise or genre…"
              aria-label="Search movies"
              className="w-full bg-transparent text-base text-white placeholder:text-white/40 focus:outline-none"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-white/40 hover:text-white"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-5">
            {query.trim() ? (
              results.length > 0 ? (
                <ul className="space-y-2">
                  {results.map((m) => (
                    <li key={m.id}>
                      <Link
                        to={`/movie/${m.id}`}
                        onClick={() => goToMovie(m.id, m.title)}
                        className="flex items-center gap-4 rounded-2xl p-2 transition-colors hover:bg-white/5"
                      >
                        <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg">
                          <MoviePoster movie={m} variant="poster" className="h-full w-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-white">{m.title}</p>
                          <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-white/55">
                            <span>{m.year}</span>
                            {m.runtime > 0 && (
                              <span className="inline-flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatRuntime(m.runtime)}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 text-yellow-300">
                              <Star className="h-3 w-3" />
                              {m.rating ? m.rating.toFixed(1) : 'TBA'}
                            </span>
                          </p>
                        </div>
                        <span className="hidden rounded-full border border-white/15 px-2.5 py-1 text-[11px] uppercase tracking-wide text-white/50 sm:inline">
                          {m.franchise}
                        </span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <button
                      type="button"
                      onClick={() => goToSearch(query)}
                      className="mt-2 w-full cursor-pointer rounded-2xl border border-dashed border-white/20 px-4 py-3 text-center text-sm text-white/70 transition hover:border-white/40 hover:text-white"
                    >
                      View all results for “{query}”
                    </button>
                  </li>
                </ul>
              ) : (
                <div className="py-10 text-center">
                  <p className="text-white/70">No matches for “{query}”.</p>
                  <p className="mt-1 text-sm text-white/45">Try a character name, actor, franchise, or genre.</p>
                </div>
              )
            ) : (
              <div className="space-y-7">
                {recent.length > 0 && (
                  <section>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">Recent searches</h3>
                      <button
                        type="button"
                        onClick={clearRecent}
                        className="cursor-pointer text-xs text-white/40 transition hover:text-white"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recent.map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => goToSearch(q)}
                          className="cursor-pointer rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/80 transition hover:border-white/35 hover:text-white"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                <section>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/50">Popular right now</h3>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_QUERIES.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => goToSearch(q)}
                        className="cursor-pointer rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/80 transition hover:border-white/35 hover:text-white"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/50">Trending titles</h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {popularTitles.map((m) =>
                      m ? (
                        <Link
                          key={m.id}
                          to={`/movie/${m.id}`}
                          onClick={() => goToMovie(m.id, m.title)}
                          className="group block"
                        >
                          <div className="aspect-[2/3] overflow-hidden rounded-lg">
                            <MoviePoster movie={m} variant="poster" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          </div>
                          <p className="mt-2 truncate text-sm text-white/75 group-hover:text-white">{m.title}</p>
                        </Link>
                      ) : null,
                    )}
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
