import { Link } from 'react-router-dom'
import type { Movie } from '../types'
import {
  FEATURED_ID,
  TRENDING_IDS,
  latest,
  popular,
  classics,
  franchises,
  characters,
  genres,
  years,
  upcoming,
  FEATURED_CHARACTERS,
  getMovie,
  MOVIES,
  UNIVERSES,
} from '../data'
import { MoviePoster } from '../components/MoviePoster'
import { MovieCard } from '../components/MovieCard'
import { MovieGrid } from '../components/MovieGrid'
import { Carousel } from '../components/Carousel'
import { SectionHeader } from '../components/SectionHeader'
import { CharacterCard } from '../components/CharacterCard'
import { FranchiseCard } from '../components/FranchiseCard'
import { Reveal } from '../components/Reveal'
import { WatchlistButton } from '../components/WatchlistButton'
import { usePageMeta } from '../hooks/usePageMeta'
import { formatRuntime, formatDate } from '../lib/format'
import {
  Play,
  Clock,
  Calendar,
  ArrowRight,
  Search,
  Star,
  FilmIcon,
} from '../components/icons'

export function Home() {
  usePageMeta(
    'HERO REEL — Movie Discovery Universe',
    'Browse, search, and explore the complete Marvel film library — from classic 1980s adventures to the latest cinematic releases.',
  )

  const featured = getMovie(FEATURED_ID) ?? MOVIES[0]
  const trending = TRENDING_IDS.map((id) => getMovie(id)).filter((m): m is Movie => m !== undefined && m.status === 'released')
  const topFranchises = franchises().filter((f) => f.movies.some((m) => m.status === 'released')).slice(0, 4)
  const featuredCharacters = characters().filter((c) => FEATURED_CHARACTERS.includes(c.name)).slice(0, 12)
  const allGenres = genres()
  const allYears = years()
  const upcomingFilms = upcoming()

  return (
    <div className="overflow-x-clip">
      {/* ---------- Hero ---------- */}
      <Hero movie={featured} />

      {/* ---------- Trending ---------- */}
      <section aria-labelledby="trending-heading" className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
        <Reveal>
          <SectionHeader
            eyebrow="Now playing in your imagination"
            title="Trending Now"
            linkTo="/movies"
            linkLabel="Browse all movies"
          />
        </Reveal>
        <Reveal delay={80}>
          <Carousel label="Trending movies" itemClassName="w-44 sm:w-52 md:w-56">
            {trending.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </Carousel>
        </Reveal>
      </section>

      {/* ---------- Latest Releases ---------- */}
      <section aria-labelledby="latest-heading" className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <Reveal>
          <SectionHeader
            eyebrow="Fresh off the presses"
            title="Latest Releases"
            description="The newest heroes to hit the big screen."
            linkTo="/movies?sort=newest"
            linkLabel="See everything new"
          />
        </Reveal>
        <MovieGrid movies={latest()} eagerFrom={4} />
      </section>

      {/* ---------- Popular ---------- */}
      <section aria-labelledby="popular-heading" className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <Reveal>
          <SectionHeader
            eyebrow="Crowd favorites"
            title="Most Popular"
            description="The highest-rated adventures across the entire library."
            linkTo="/movies?sort=rating"
            linkLabel="Top rated"
          />
        </Reveal>
        <MovieGrid movies={popular()} />
      </section>

      {/* ---------- Franchise Spotlight ---------- */}
      {topFranchises.map((f, idx) => (
        <section key={f.name} aria-labelledby={`franchise-${f.name}-heading`} className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow={`Spotlight ${idx + 1}`}
              title={f.name}
              description={`${f.count} ${f.count === 1 ? 'film' : 'films'} — from ${f.movies[0]?.year} to ${f.movies[f.movies.length - 1]?.year}.`}
              linkTo={`/movies?franchise=${encodeURIComponent(f.name)}`}
              linkLabel={`All ${f.name} movies`}
            />
          </Reveal>
          <Reveal delay={80}>
            <Carousel label={`${f.name} movies`} itemClassName="w-44 sm:w-52 md:w-56">
              {f.movies.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </Carousel>
          </Reveal>
        </section>
      ))}

      {/* ---------- Classics ---------- */}
      <section aria-labelledby="classics-heading" className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <Reveal>
          <SectionHeader
            eyebrow="Where it all began"
            title="Classic Marvel Movies"
            description="The pre-MCU films that shaped the genre — Blade, X-Men, Spider-Man and more."
            linkTo="/movies?universe=marvel-legacy"
            linkLabel="All classics"
          />
        </Reveal>
        <MovieGrid movies={classics()} />
      </section>

      {/* ---------- Universes ---------- */}
      <section aria-labelledby="universes-heading" className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <Reveal>
          <SectionHeader
            eyebrow="One library, many worlds"
            title="Explore the Universes"
            description="Every saga lives in its own universe. Dive into the one that calls to you."
            linkTo="/franchises"
            linkLabel="All franchises"
          />
        </Reveal>
        <Reveal delay={80}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {UNIVERSES.map((u) => {
              const reps = MOVIES.filter((m) => m.universe === u.id && m.status === 'released')
              const rep = reps[reps.length - 1] ?? reps[0]
              if (!rep) return null
              return (
                <FranchiseCard
                  key={u.id}
                  name={u.name}
                  count={reps.length}
                  avgRating={0}
                  representative={rep}
                  description={u.description}
                />
              )
            })}
          </div>
        </Reveal>
      </section>

      {/* ---------- Characters ---------- */}
      <section aria-labelledby="characters-heading" className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <Reveal>
          <SectionHeader
            eyebrow="Meet the icons"
            title="Character Collections"
            description="Follow a hero from their first appearance to their final battle."
            linkTo="/characters"
            linkLabel="All characters"
          />
        </Reveal>
        <Reveal delay={80}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-6">
            {featuredCharacters.map((c) => (
              <CharacterCard key={c.name} name={c.name} count={c.count} representative={c.movies[0]} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* ---------- Years ---------- */}
      <section aria-labelledby="years-heading" className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <Reveal>
          <SectionHeader
            eyebrow="A timeline of heroics"
            title="Explore by Year"
            description="Jump to any era of the cinematic saga."
            linkTo="/years"
            linkLabel="Browse years"
          />
        </Reveal>
        <Reveal delay={80}>
          <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-2">
            {allYears.map((y) => (
              <Link
                key={y}
                to={`/movies?year=${y}`}
                className="flex h-16 w-20 shrink-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] transition hover:border-[var(--t-primary)] hover:bg-white/[0.08]"
              >
                <span className="heading-display text-2xl text-white">{y}</span>
                <span className="text-[10px] uppercase tracking-wider text-white/40">
                  {MOVIES.filter((m) => m.year === y).length} films
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ---------- Genres ---------- */}
      <section aria-labelledby="genres-heading" className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <Reveal>
          <SectionHeader eyebrow="Pick your flavor" title="Browse by Genre" description="Action, horror, comedy — there's a universe for every mood." />
        </Reveal>
        <Reveal delay={80}>
          <div className="flex flex-wrap gap-2.5">
            {allGenres.map((g, i) => (
              <Link
                key={g}
                to={`/movies?genre=${encodeURIComponent(g)}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm text-white/70 transition hover:border-[var(--t-primary)] hover:bg-white/[0.08] hover:text-white"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: i % 3 === 0 ? 'var(--t-primary)' : i % 3 === 1 ? 'var(--t-secondary)' : 'var(--t-glow)' }}
                />
                {g}
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ---------- Upcoming ---------- */}
      {upcomingFilms.length > 0 && (
        <section aria-labelledby="upcoming-heading" className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="On the horizon"
              title="Coming Soon"
              description="Heroes in the making — the next chapter of the saga."
              linkTo="/movies?status=upcoming"
              linkLabel="All upcoming"
            />
          </Reveal>
          <MovieGrid movies={upcomingFilms} />
        </section>
      )}

      {/* ---------- Discovery CTA ---------- */}
      <section aria-labelledby="discovery-heading" className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <Reveal>
          <div className="glass-tint relative overflow-hidden rounded-3xl border border-white/10 px-6 py-14 text-center sm:px-12 sm:py-20">
            <div
              className="pointer-events-none absolute inset-0 animate-pulse-glow"
              style={{ background: 'radial-gradient(60% 80% at 50% 0%, color-mix(in srgb, var(--t-glow) 22%, transparent), transparent)' }}
            />
            <div className="relative">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--t-primary)]">Your universe awaits</p>
              <h2 className="heading-display mx-auto max-w-3xl text-5xl leading-none text-white text-glow sm:text-7xl">
                Every hero. Every story. One reel.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-white/70">
                Search {MOVIES.length} movies, filter by franchise and character, and build your own watchlist in seconds.
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link to="/search" className="btn-red px-7 py-3 text-sm">
                  <Search className="h-4 w-4" /> Search the library
                </Link>
                <Link to="/movies" className="btn-ghost px-7 py-3 text-sm">
                  <FilmIcon className="h-4 w-4" /> Browse all movies
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

function Hero({ movie }: { movie: Movie }) {
  const trailerId = movie?.trailer
  return (
    <section className="relative min-h-[82vh] w-full overflow-hidden" aria-label="Featured movie">
      <div className="absolute inset-0">
        {movie && <MoviePoster movie={movie} variant="backdrop" eager className="h-full w-full object-cover animate-kenburns" />}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, var(--t-bg-to) 88%), linear-gradient(90deg, rgba(5,6,10,0.85) 0%, rgba(5,6,10,0.25) 55%, transparent 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(90% 70% at 20% 40%, color-mix(in srgb, var(--t-glow) 16%, transparent), transparent)' }} />
      </div>

      <div className="relative mx-auto flex min-h-[82vh] max-w-7xl flex-col justify-end px-4 pb-20 pt-32 sm:px-6 sm:pb-28">
        {movie && (
          <div className="max-w-2xl animate-fade-up">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-[#ff3b3b] to-[#c81818] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-[0_6px_18px_-4px_rgba(230,36,41,0.6)]">
                <Star className="h-3.5 w-3.5" /> Featured Film
              </span>
              <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
                {movie.franchise}
              </span>
              {movie.status === 'upcoming' && (
                <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
                  Upcoming
                </span>
              )}
            </div>

            <h1 className="heading-display text-6xl leading-[0.95] text-white text-glow sm:text-8xl">
              {movie.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/75">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {movie.status === 'upcoming' ? formatDate(movie.releaseDate) : movie.year}
              </span>
              {movie.runtime > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {formatRuntime(movie.runtime)}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-yellow-300">
                <Star className="h-4 w-4" />
                {movie.rating ? movie.rating.toFixed(1) : 'TBA'}
                <span className="text-white/40">/ 10</span>
              </span>
            </div>

            <p className="mt-5 line-clamp-3 max-w-xl leading-relaxed text-white/75 sm:line-clamp-4">{movie.synopsis}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {trailerId ? (
                <Link to={`/movie/${movie.id}#trailer`} className="btn-red px-7 py-3 text-sm">
                  <Play className="h-4 w-4" /> Watch Trailer
                </Link>
              ) : null}
              <Link to={`/movie/${movie.id}`} className="btn-ghost px-7 py-3 text-sm">
                View Details <ArrowRight className="h-4 w-4" />
              </Link>
              <WatchlistButton id={movie.id} label="Save" />
            </div>
          </div>
        )}
      </div>

      <a
        href="#trending-heading"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/40 transition hover:text-white/80 sm:flex"
        aria-label="Scroll to trending movies"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/25 p-1">
          <span className="h-2 w-1 animate-bounce rounded-full bg-white/70" />
        </span>
      </a>
    </section>
  )
}
