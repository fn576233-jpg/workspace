import { useMemo, useState } from 'react'
import { characters, FEATURED_CHARACTERS } from '../data'
import { CharacterCard } from '../components/CharacterCard'
import { SectionHeader } from '../components/SectionHeader'
import { Reveal } from '../components/Reveal'
import { EmptyState } from '../components/EmptyState'
import { usePageMeta } from '../hooks/usePageMeta'
import { Search, UsersIcon } from '../components/icons'

export function Characters() {
  usePageMeta('Characters — HERO REEL', 'Explore every Marvel character and the films they star in, from Iron Man to Miles Morales.')
  const [query, setQuery] = useState('')

  const all = characters()
  const featured = all.filter((c) => FEATURED_CHARACTERS.includes(c.name)).slice(0, 16)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return all
    return all.filter((c) => c.name.toLowerCase().includes(q))
  }, [query, all])

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="Every hero, every villain"
          title="Characters"
          description={`Follow ${all.length} characters across every movie in the library.`}
        />
      </Reveal>

      {featured.length > 0 && (
        <Reveal delay={60}>
          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5 lg:grid-cols-6 xl:grid-cols-8">
            {featured.map((c) => (
              <CharacterCard key={c.name} name={c.name} count={c.count} representative={c.movies[0]} />
            ))}
          </div>
        </Reveal>
      )}

      <Reveal delay={80}>
        <div className="relative mb-6 max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search characters…"
            aria-label="Search characters"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-12 pr-4 text-white placeholder:text-white/40 backdrop-blur transition focus:border-[var(--t-primary)] focus:outline-none"
          />
        </div>
      </Reveal>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-6">
          {filtered.map((c, i) => (
            <Reveal key={c.name} delay={(i % 6) * 50}>
              <CharacterCard name={c.name} count={c.count} representative={c.movies[0]} />
            </Reveal>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<UsersIcon className="h-12 w-12" />}
          title="No characters found"
          description={`No characters matched “${query}”. Try another name.`}
        />
      )}
    </div>
  )
}
