import { useMemo, useState } from 'react'
import { franchises } from '../data'
import { FranchiseCard } from '../components/FranchiseCard'
import { SectionHeader } from '../components/SectionHeader'
import { Reveal } from '../components/Reveal'
import { EmptyState } from '../components/EmptyState'
import { usePageMeta } from '../hooks/usePageMeta'
import { LayersIcon, Search } from '../components/icons'

export function Franchises() {
  usePageMeta('Franchises — HERO REEL', 'Browse Marvel movie franchises from the MCU to Spider-Man, X-Men, Blade and beyond.')
  const [query, setQuery] = useState('')

  const all = franchises()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return all
    return all.filter((f) => f.name.toLowerCase().includes(q) || f.movies.some((m) => m.title.toLowerCase().includes(q)))
  }, [query, all])

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="Sagas and series"
          title="Franchises"
          description={`${all.length} franchises across ${all.reduce((acc, f) => acc + f.count, 0)} films. Pick a saga and dive in.`}
        />
      </Reveal>

      <Reveal delay={60}>
        <div className="relative mb-6 max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search franchises…"
            aria-label="Search franchises"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-12 pr-4 text-white placeholder:text-white/40 backdrop-blur transition focus:border-[var(--t-primary)] focus:outline-none"
          />
        </div>
      </Reveal>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((f, i) => (
            <Reveal key={f.name} delay={(i % 3) * 60}>
              <FranchiseCard
                name={f.name}
                count={f.count}
                avgRating={f.avgRating}
                representative={f.movies[f.movies.length - 1]}
                description={`${f.movies[0]?.year} – ${f.movies[f.movies.length - 1]?.year} · ${f.movies[0]?.franchise}`}
              />
            </Reveal>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<LayersIcon className="h-12 w-12" />}
          title="No franchises found"
          description={`Nothing matched “${query}”. Try a franchise name or a film title.`}
        />
      )}
    </div>
  )
}
