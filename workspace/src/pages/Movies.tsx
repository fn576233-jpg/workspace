import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MOVIES, franchises, characters, genres, years, UNIVERSES } from '../data'
import { filterMovies, sortMovies, searchScore, type SortKey } from '../lib/search'
import { MovieGrid } from '../components/MovieGrid'
import { SkeletonMovieGrid } from '../components/Skeletons'
import { EmptyState } from '../components/EmptyState'
import { SectionHeader } from '../components/SectionHeader'
import { Reveal } from '../components/Reveal'
import { usePageMeta } from '../hooks/usePageMeta'
import { ArrowLeft, ArrowRight, FilmIcon, Search, SlidersIcon, XIcon } from '../components/icons'

const PAGE_SIZE = 18

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'newest', label: 'Newest first' },
  { key: 'oldest', label: 'Oldest first' },
  { key: 'popularity', label: 'Most popular' },
  { key: 'rating', label: 'Highest rated' },
  { key: 'title', label: 'Title A–Z' },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All releases' },
  { value: 'released', label: 'Released' },
  { value: 'upcoming', label: 'Upcoming' },
]

interface Filters {
  q: string
  genre: string
  franchise: string
  character: string
  year: string
  universe: string
  status: string
  sort: SortKey
}

export function Movies() {
  const [params, setParams] = useSearchParams()
  const [loading, setLoading] = useState(true)

  usePageMeta(
    'Movies — HERO REEL Movie Library',
    `Browse and filter all ${MOVIES.length} Marvel movies — by genre, franchise, character, year and more.`,
  )

  const paramsString = params.toString()

  const filters: Filters = useMemo(() => {
    const p = new URLSearchParams(paramsString)
    return {
      q: p.get('q') ?? '',
      genre: p.get('genre') ?? '',
      franchise: p.get('franchise') ?? '',
      character: p.get('character') ?? '',
      year: p.get('year') ?? '',
      universe: p.get('universe') ?? '',
      status: p.get('status') ?? 'all',
      sort: (p.get('sort') as SortKey) ?? 'popularity',
    }
  }, [paramsString])

  const page = Math.max(1, Number(params.get('page') ?? '1') || 1)

  useEffect(() => {
    setLoading(true)
    const t = window.setTimeout(() => setLoading(false), 380)
    return () => window.clearTimeout(t)
  }, [paramsString])

  const setFilter = (key: keyof Filters, value: string) => {
    const next = new URLSearchParams(params)
    if (value && value !== '' && !(key === 'status' && value === 'all') && !(key === 'sort' && value === 'popularity')) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    next.delete('page')
    setParams(next, { replace: false })
  }

  const clearAll = () => setParams(new URLSearchParams(), { replace: false })
  const clearFilter = (key: keyof Filters) => setFilter(key, '')

  const results = useMemo(() => {
    let list = filterMovies({
      genre: filters.genre || undefined,
      franchise: filters.franchise || undefined,
      character: filters.character || undefined,
      year: filters.year || undefined,
      universe: filters.universe || undefined,
      status: filters.status === 'all' ? undefined : (filters.status as 'released' | 'upcoming'),
    })
    if (filters.q) list = list.filter((m) => searchScore(m, filters.q) > 0)
    return sortMovies(list, filters.sort)
  }, [filters])

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visible = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const activeCount = [
    filters.q,
    filters.genre,
    filters.franchise,
    filters.character,
    filters.year,
    filters.universe,
    filters.status === 'all' ? '' : filters.status,
    filters.sort !== 'popularity' ? filters.sort : '',
  ].filter(Boolean).length

  const franchiseOptions = franchises()
  const characterOptions = characters()
  const yearOptions = years()
  const genreOptions = genres()

  const activeChips: { key: keyof Filters; label: string }[] = []
  if (filters.q) activeChips.push({ key: 'q', label: `“${filters.q}”` })
  if (filters.genre) activeChips.push({ key: 'genre', label: filters.genre })
  if (filters.franchise) activeChips.push({ key: 'franchise', label: filters.franchise })
  if (filters.character) activeChips.push({ key: 'character', label: filters.character })
  if (filters.year) activeChips.push({ key: 'year', label: String(filters.year) })
  if (filters.universe) activeChips.push({ key: 'universe', label: UNIVERSES.find((u) => u.id === filters.universe)?.name ?? filters.universe })
  if (filters.status !== 'all') activeChips.push({ key: 'status', label: filters.status === 'upcoming' ? 'Upcoming' : 'Released' })

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="The complete collection"
          title="Movie Library"
          description={`Explore all ${results.length} Marvel films across every universe, era, and franchise.`}
        />
      </Reveal>

      {/* Search */}
      <Reveal delay={60}>
        <div className="relative mb-6">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
          <input
            type="search"
            value={filters.q}
            onChange={(e) => setFilter('q', e.target.value)}
            placeholder="Search the library by title, character, actor, franchise or genre…"
            aria-label="Search the movie library"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3.5 pl-12 pr-4 text-white placeholder:text-white/40 backdrop-blur transition focus:border-[var(--t-primary)] focus:outline-none"
          />
          {filters.q && (
            <button
              type="button"
              onClick={() => clearFilter('q')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-white/50 hover:text-white"
            >
              <XIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </Reveal>

      {/* Filter controls */}
      <Reveal delay={100}>
        <div className="glass mb-4 rounded-2xl p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/80">
              <SlidersIcon className="h-4 w-4 text-[var(--t-primary)]" /> Filters
            </span>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="cursor-pointer text-xs font-semibold text-[var(--t-primary)] transition hover:text-[var(--t-glow)]"
              >
                Clear all ({activeCount})
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-8">
            <StatusPills value={filters.status} onChange={(v) => setFilter('status', v)} />
            <Select
              label="Genre"
              value={filters.genre}
              onChange={(v) => setFilter('genre', v)}
              options={genreOptions}
              placeholder="All genres"
            />
            <Select
              label="Franchise"
              value={filters.franchise}
              onChange={(v) => setFilter('franchise', v)}
              options={franchiseOptions.map((f) => f.name)}
              placeholder="All franchises"
            />
            <Select
              label="Character"
              value={filters.character}
              onChange={(v) => setFilter('character', v)}
              options={characterOptions.map((c) => c.name)}
              placeholder="All characters"
            />
            <Select
              label="Year"
              value={filters.year}
              onChange={(v) => setFilter('year', v)}
              options={yearOptions.map(String)}
              placeholder="All years"
            />
            <Select
              label="Universe"
              value={filters.universe}
              onChange={(v) => setFilter('universe', v)}
              options={UNIVERSES.map((u) => u.name)}
              placeholder="All universes"
            />
            <Select
              label="Sort"
              value={filters.sort}
              onChange={(v) => setFilter('sort', v)}
              options={SORTS.map((s) => s.label)}
              placeholder="Sort by"
            />
          </div>
        </div>
      </Reveal>

      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2" aria-label="Active filters">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => clearFilter(chip.key)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--t-primary)_45%,transparent)] bg-[color-mix(in_srgb,var(--t-primary)_14%,transparent)] px-3 py-1.5 text-xs font-medium text-white transition hover:border-[var(--t-primary)]"
            >
              {chip.label}
              <XIcon className="h-3 w-3" />
            </button>
          ))}
          <span className="ml-1 text-xs text-white/40">{results.length} results</span>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <SkeletonMovieGrid count={PAGE_SIZE} />
      ) : visible.length > 0 ? (
        <MovieGrid movies={visible} />
      ) : (
        <EmptyState
          icon={<FilmIcon className="h-12 w-12" />}
          title="No movies match your filters"
          description="Try adjusting your search, removing a filter, or exploring a different franchise or year."
          action={
            <button type="button" onClick={clearAll} className="btn-red cursor-pointer px-6 py-2.5 text-sm">
              Clear all filters
            </button>
          }
        />
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
          <PagerButton
            disabled={currentPage <= 1}
            onClick={() => setPage(currentPage - 1)}
            ariaLabel="Go to previous page"
          >
            <ArrowLeft className="h-4 w-4" />
          </PagerButton>

          {pageNumbers(currentPage, totalPages).map((p, i) =>
            p === '…' ? (
              <span key={`gap-${i}`} className="px-1 text-white/40">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => setPage(Number(p))}
                aria-current={p === currentPage ? 'page' : undefined}
                aria-label={`Page ${p}`}
                className={`h-10 w-10 cursor-pointer rounded-full border text-sm font-semibold transition ${
                  p === currentPage
                    ? 'border-transparent bg-gradient-to-b from-[#ff3b3b] to-[#c81818] text-white shadow-[0_6px_18px_-4px_rgba(230,36,41,0.6)]'
                    : 'border-white/15 bg-white/[0.04] text-white/70 hover:border-white/35 hover:text-white'
                }`}
              >
                {p}
              </button>
            ),
          )}

          <PagerButton
            disabled={currentPage >= totalPages}
            onClick={() => setPage(currentPage + 1)}
            ariaLabel="Go to next page"
          >
            <ArrowRight className="h-4 w-4" />
          </PagerButton>
        </nav>
      )}
    </div>
  )

  function setPage(p: number) {
    const next = new URLSearchParams(params)
    if (p <= 1) next.delete('page')
    else next.set('page', String(p))
    setParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function PagerButton({ children, onClick, disabled, ariaLabel }: { children: ReactNode; onClick: () => void; disabled: boolean; ariaLabel: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/70 transition hover:border-white/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  )
}

function Select({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (v: string) => void; options: string[]; placeholder: string }) {
  return (
    <label className="block lg:col-span-1">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/45">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer rounded-xl border border-white/10 bg-[#0a0c14] px-3 py-2 text-sm text-white transition focus:border-[var(--t-primary)] focus:outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

function StatusPills({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="lg:col-span-2">
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/45">Release status</span>
      <div className="flex rounded-xl border border-white/10 bg-[#0a0c14] p-1">
        {STATUS_OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            className={`flex-1 cursor-pointer rounded-lg px-2 py-1.5 text-xs font-semibold transition ${
              value === o.value ? 'bg-[var(--t-primary)] text-white shadow' : 'text-white/60 hover:text-white'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function pageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const set = new Set<number>([1, total, current - 1, current, current + 1])
  const nums = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b)
  const out: (number | '…')[] = []
  let prev = 0
  for (const n of nums) {
    if (prev && n - prev > 1) out.push('…')
    out.push(n)
    prev = n
  }
  return out
}
