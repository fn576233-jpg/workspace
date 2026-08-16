import { Link } from 'react-router-dom'
import type { Movie } from '../types'
import { formatRuntime } from '../lib/format'
import { MoviePoster } from './MoviePoster'
import { RatingBadge } from './RatingBadge'
import { WatchlistButton } from './WatchlistButton'
import { ArrowRight, Clock, Play } from './icons'

interface Props {
  movie: Movie
  eager?: boolean
}

export function MovieCard({ movie, eager }: Props) {
  const upcoming = movie.status === 'upcoming'

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-[var(--t-bg-via)] shadow-lg shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-2xl hover:shadow-[color-mix(in_srgb,var(--t-glow)_25%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--t-primary)]"
      aria-label={`${movie.title} (${movie.year}) — view details`}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <MoviePoster
          movie={movie}
          variant="poster"
          eager={eager}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
        />

        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background:
              'linear-gradient(180deg, rgba(5,6,10,0.15) 35%, rgba(5,6,10,0.6) 62%, rgba(5,6,10,0.96) 100%)',
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: 'radial-gradient(120% 90% at 50% 100%, color-mix(in srgb, var(--t-glow) 20%, transparent), transparent 60%)' }}
        />

        {upcoming && (
          <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur">
            Upcoming
          </span>
        )}

        <div className="absolute right-3 top-3 opacity-80 transition-opacity group-hover:opacity-100">
          <WatchlistButton id={movie.id} />
        </div>

        {/* Bottom info, always visible */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="heading-display text-xl leading-tight text-white transition-colors group-hover:text-[var(--t-glow)]">
            {movie.title}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-white/70">
            <span>{movie.year}</span>
            {movie.runtime > 0 && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatRuntime(movie.runtime)}
              </span>
            )}
            <RatingBadge rating={movie.rating} />
          </div>

          {/* Hover overlay */}
          <div className="grid max-h-0 grid-rows-[0fr] opacity-0 transition-all duration-500 ease-out group-hover:max-h-52 group-hover:opacity-100">
            <div className="min-h-0 overflow-hidden">
              <div className="flex flex-wrap gap-1.5 pt-3">
                {movie.genres.slice(0, 3).map((g) => (
                  <span key={g} className="rounded-full border border-white/15 bg-black/40 px-2 py-0.5 text-[11px] text-white/80">
                    {g}
                  </span>
                ))}
              </div>
              <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-white/80">{movie.synopsis}</p>
              <div className="mt-3 flex items-center gap-2 pb-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-[#ff3b3b] to-[#c81818] px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_6px_18px_-4px_rgba(230,36,41,0.6)]">
                  View Details <ArrowRight className="h-3.5 w-3.5" />
                </span>
                {movie.trailer && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                    <Play className="h-3.5 w-3.5" /> Trailer
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
