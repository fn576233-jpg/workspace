import { Link } from 'react-router-dom'
import { years, MOVIES } from '../data'
import { MovieCard } from '../components/MovieCard'
import { SectionHeader } from '../components/SectionHeader'
import { Reveal } from '../components/Reveal'
import { usePageMeta } from '../hooks/usePageMeta'
import { Calendar, ChevronRight } from '../components/icons'

export function Years() {
  usePageMeta('Years — HERO REEL', 'Explore Marvel movies by release year, from 1986 to today.')

  const allYears = years()
  const byYear = new Map<number, typeof MOVIES>()
  for (const m of MOVIES) {
    const list = byYear.get(m.year) ?? []
    list.push(m)
    byYear.set(m.year, list)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6">
      <Reveal>
        <SectionHeader
          eyebrow="A timeline of heroics"
          title="Explore by Year"
          description={`${allYears.length} different release years in the collection — every era of the saga.`}
        />
      </Reveal>

      <Reveal delay={60}>
        <div className="no-scrollbar sticky top-16 z-30 -mx-4 mb-10 flex gap-2 overflow-x-auto border-b border-white/[0.06] bg-[var(--t-bg-to)]/85 px-4 py-3 backdrop-blur sm:mx-0 sm:px-0">
          {allYears.map((y) => (
            <a
              key={y}
              href={`#year-${y}`}
              className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-sm text-white/70 transition hover:border-[var(--t-primary)] hover:text-white"
            >
              {y}
            </a>
          ))}
        </div>
      </Reveal>

      <div className="space-y-14">
        {allYears.map((y, idx) => {
          const films = (byYear.get(y) ?? []).sort((a, b) => a.releaseDate.localeCompare(b.releaseDate))
          return (
            <section key={y} id={`year-${y}`} aria-labelledby={`year-${y}-heading`} className="scroll-mt-32">
              <Reveal>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <span className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--t-primary)]">
                      <Calendar className="h-3.5 w-3.5" /> {idx + 1} of {allYears.length}
                    </span>
                    <h2 id={`year-${y}-heading`} className="heading-display text-4xl text-white sm:text-5xl">
                      {y}
                    </h2>
                  </div>
                  <Link
                    to={`/movies?year=${y}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-white/60 transition hover:text-[var(--t-glow)]"
                  >
                    View in library <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </Reveal>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
                {films.map((m, i) => (
                  <Reveal key={m.id} delay={(i % 5) * 50}>
                    <MovieCard movie={m} />
                  </Reveal>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
