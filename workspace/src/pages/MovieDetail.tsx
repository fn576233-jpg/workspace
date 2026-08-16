import { Link, useParams } from 'react-router-dom'
import { getMovie, relatedMovies, moviesForFranchise, getUniverse } from '../data'
import { TRAILERS } from '../data/trailers'
import { MoviePoster } from '../components/MoviePoster'
import { MovieGrid } from '../components/MovieGrid'
import { SectionHeader } from '../components/SectionHeader'
import { WatchlistButton } from '../components/WatchlistButton'
import { RatingBadge } from '../components/RatingBadge'
import { Reveal } from '../components/Reveal'
import { EmptyState } from '../components/EmptyState'
import { usePageMeta } from '../hooks/usePageMeta'
import { formatRuntime, formatDate } from '../lib/format'
import { officialSources } from '../lib/sources'
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  GlobeIcon,
  InfoIcon,
  Play,
  Star,
  UsersIcon,
  FilmIcon,
} from '../components/icons'

export function MovieDetail() {
  const { id } = useParams()
  const movie = id ? getMovie(id) : undefined

  usePageMeta(
    movie ? `${movie.title} (${movie.year}) — HERO REEL` : 'Movie not found — HERO REEL',
    movie?.synopsis.slice(0, 155),
  )

  if (!movie) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24">
        <EmptyState
          icon={<FilmIcon className="h-12 w-12" />}
          title="Movie not found"
          description="We couldn't find that title in the library. It may have been moved or renamed."
          action={
            <Link to="/movies" className="btn-red px-6 py-2.5 text-sm">
              Browse all movies
            </Link>
          }
        />
      </div>
    )
  }

  const trailerInfo = movie.trailer ? TRAILERS[movie.id] : undefined
  const related = relatedMovies(movie, 10)
  const sameFranchise = moviesForFranchise(movie.franchise).filter((m) => m.id !== movie.id)
  const universe = getUniverse(movie.universe)
  const sources = officialSources(movie)
  const upcoming = movie.status === 'upcoming'

  return (
    <div>
      {/* ---------- Backdrop hero ---------- */}
      <section className="relative min-h-[62vh] w-full overflow-hidden" aria-label={`${movie.title} hero`}>
        <div className="absolute inset-0">
          <MoviePoster movie={movie} variant="backdrop" eager className="h-full w-full object-cover animate-kenburns" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(5,6,10,0.45) 0%, rgba(5,6,10,0.35) 45%, var(--t-bg-to) 100%), radial-gradient(100% 80% at 75% 30%, color-mix(in srgb, var(--t-glow) 14%, transparent), transparent)',
            }}
          />
        </div>

        <div className="relative mx-auto flex min-h-[62vh] max-w-7xl flex-col px-4 pb-10 pt-6 sm:px-6">
          <Link
            to="/movies"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-sm text-white/80 backdrop-blur transition hover:border-white/45 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Movies
          </Link>

          <div className="mt-auto animate-fade-up">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {universe && (
                <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
                  {universe.name}
                </span>
              )}
              <span className="rounded-full border border-white/20 bg-black/40 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
                {movie.franchise}
              </span>
              {upcoming && (
                <span className="rounded-full bg-gradient-to-b from-[#ff3b3b] to-[#c81818] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  Upcoming
                </span>
              )}
            </div>

            <h1 className="heading-display max-w-4xl text-5xl leading-[0.95] text-white text-glow sm:text-7xl md:text-8xl">
              {movie.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(movie.releaseDate)}
              </span>
              {movie.runtime > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {formatRuntime(movie.runtime)}
                </span>
              )}
              <RatingBadge rating={movie.rating} className="border border-white/15 bg-black/50 backdrop-blur" />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {trailerInfo && (
                <Link to="#trailer" className="btn-red px-6 py-2.5 text-sm">
                  <Play className="h-4 w-4" /> Watch Trailer
                </Link>
              )}
              <WatchlistButton id={movie.id} variant="pill" label="Save" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Content ---------- */}
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="mt-10 grid gap-10 lg:grid-cols-[300px_1fr]">
          {/* Poster */}
          <Reveal className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/60">
              <MoviePoster movie={movie} variant="poster" className="aspect-[2/3] w-full object-cover" />
            </div>
            <div className="mt-4 flex justify-center gap-3">
              {trailerInfo && (
                <Link to="#trailer" className="btn-ghost px-4 py-2 text-sm">
                  <Play className="h-4 w-4" /> Trailer
                </Link>
              )}
              <WatchlistButton id={movie.id} label="Save" className="px-4 py-2 text-sm" />
            </div>
          </Reveal>

          {/* Details */}
          <div className="min-w-0">
            <Reveal>
              <section aria-labelledby="synopsis-heading">
                <h2 id="synopsis-heading" className="heading-display text-2xl text-white">
                  Synopsis
                </h2>
                <p className="mt-3 leading-relaxed text-white/75">{movie.synopsis}</p>
              </section>
            </Reveal>

            <Reveal delay={60}>
              <section className="mt-8" aria-label="Movie information">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoTile label="Director" value={movie.director} />
                  <InfoTile label="Runtime" value={movie.runtime > 0 ? formatRuntime(movie.runtime) : 'To be announced'} />
                  <InfoTile label="Release date" value={formatDate(movie.releaseDate)} />
                  <InfoTile label="Rating" value={movie.rating ? `${movie.rating.toFixed(1)} / 10` : 'To be announced'} />
                  <InfoTile label="Franchise" value={movie.franchise} />
                  <InfoTile label="Status" value={upcoming ? 'Upcoming' : 'Released'} />
                </div>
              </section>
            </Reveal>

            <Reveal delay={90}>
              <section className="mt-8" aria-label="Genres">
                <h3 className="heading-display text-2xl text-white">Genres</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {movie.genres.map((g) => (
                    <Link
                      key={g}
                      to={`/movies?genre=${encodeURIComponent(g)}`}
                      className="rounded-full border border-[color-mix(in_srgb,var(--t-primary)_45%,transparent)] bg-[color-mix(in_srgb,var(--t-primary)_12%,transparent)] px-3.5 py-1.5 text-sm text-white transition hover:border-[var(--t-primary)]"
                    >
                      {g}
                    </Link>
                  ))}
                </div>
              </section>
            </Reveal>

            <Reveal delay={120}>
              <section className="mt-8" aria-label="Cast">
                <h3 className="heading-display flex items-center gap-2 text-2xl text-white">
                  <UsersIcon className="h-5 w-5 text-[var(--t-primary)]" /> Cast
                </h3>
                {movie.cast.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {movie.cast.map((c) => (
                      <li key={c} className="rounded-xl border border-white/12 bg-white/[0.04] px-3.5 py-2 text-sm text-white/80">
                        {c}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-white/50">Cast to be announced.</p>
                )}
              </section>
            </Reveal>

            <Reveal delay={150}>
              <section className="mt-8" aria-label="Characters">
                <h3 className="heading-display text-2xl text-white">Characters</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {movie.characters.map((c) => (
                    <Link
                      key={c}
                      to={`/movies?character=${encodeURIComponent(c)}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-sm text-white/80 transition hover:border-[var(--t-glow)] hover:text-white"
                    >
                      <Star className="h-3.5 w-3.5 text-[var(--t-glow)]" />
                      {c}
                    </Link>
                  ))}
                </div>
              </section>
            </Reveal>
          </div>
        </div>

        {/* ---------- Trailer ---------- */}
        <section id="trailer" aria-labelledby="trailer-heading" className="mt-20 scroll-mt-24">
          <Reveal>
            <SectionHeader eyebrow="Official footage" title="Trailer" />
          </Reveal>
          <Reveal delay={60}>
            {trailerInfo ? (
              <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-black/50">
                <div className="aspect-video w-full bg-black">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${movie.trailer}?rel=0`}
                    title={trailerInfo.title ?? `${movie.title} official trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    className="h-full w-full"
                  />
                </div>
              </div>
            ) : (
              <div className="glass rounded-3xl p-6 sm:p-8">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--t-primary)_20%,transparent)] text-[var(--t-primary)]">
                    <InfoIcon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">No trailer available here yet</h3>
                    <p className="mt-1 text-sm text-white/60">
                      For official trailers and full viewing details, check these licensed and official sources.
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {sources.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-white/80 transition hover:border-white/35 hover:text-white"
                    >
                      <GlobeIcon className="h-4 w-4 text-[var(--t-glow)]" />
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </Reveal>
        </section>

        {/* ---------- Official sources (always) ---------- */}
        <section aria-labelledby="sources-heading" className="mt-14">
          <Reveal>
            <SectionHeader
              eyebrow="Licensed & official"
              title="Where to Watch & Official Info"
              description="We only link to legitimate, official, and licensed sources. No pirated content, ever."
            />
          </Reveal>
          <Reveal delay={60}>
            <div className="grid gap-3 sm:grid-cols-3">
              {sources.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass group rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-white/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--t-primary)_18%,transparent)] text-[var(--t-primary)]">
                      <GlobeIcon className="h-5 w-5" />
                    </span>
                    <ArrowRight className="h-4 w-4 text-white/30 transition group-hover:text-white/70" />
                  </div>
                  <h3 className="mt-4 font-semibold text-white">{s.label}</h3>
                  <p className="mt-1 text-sm text-white/55">{s.note}</p>
                </a>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ---------- Same franchise ---------- */}
        {sameFranchise.length > 0 && (
          <section aria-labelledby="franchise-heading" className="mt-20">
            <Reveal>
              <SectionHeader
                eyebrow="Same universe, same saga"
                title={`More from ${movie.franchise}`}
                linkTo={`/movies?franchise=${encodeURIComponent(movie.franchise)}`}
                linkLabel="View franchise"
              />
            </Reveal>
            <MovieGrid movies={sameFranchise.slice(0, 10)} />
          </section>
        )}

        {/* ---------- Related ---------- */}
        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-20">
            <Reveal>
              <SectionHeader eyebrow="You might also like" title="Related Movies" description="Similar genres, characters, and cinematic vibes." />
            </Reveal>
            <MovieGrid movies={related} />
          </section>
        )}
      </div>
    </div>
  )
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">{label}</p>
      <p className="mt-1 text-sm font-medium text-white">{value}</p>
    </div>
  )
}
