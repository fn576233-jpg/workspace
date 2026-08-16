import { Link } from 'react-router-dom'
import type { Movie } from '../types'
import { MovieArt } from './MovieArt'
import { LayersIcon, Star } from './icons'

interface Props {
  name: string
  count: number
  avgRating: number
  representative: Movie
  description?: string
}

export function FranchiseCard({ name, count, avgRating, representative, description }: Props) {
  return (
    <Link
      to={`/movies?franchise=${encodeURIComponent(name)}`}
      className="group relative block h-44 overflow-hidden rounded-2xl border border-white/10 shadow-lg shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-2xl hover:shadow-[color-mix(in_srgb,var(--t-glow)_22%,transparent)] sm:h-52"
      aria-label={`Browse the ${name} franchise`}
    >
      <MovieArt
        motif={representative.art.motif}
        seed={`franchise-${representative.id}`}
        theme={representative.theme}
        variant="backdrop"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(100deg, rgba(5,6,10,0.92) 15%, rgba(5,6,10,0.45) 60%, transparent)' }}
      />
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <span className="mb-2 inline-flex items-center gap-1 self-start rounded-full bg-black/50 px-2 py-0.5 text-[11px] font-medium text-white/70 backdrop-blur">
          <LayersIcon className="h-3 w-3" />
          {count} {count === 1 ? 'film' : 'films'}
        </span>
        <h3 className="heading-display text-3xl leading-none text-white transition-colors group-hover:text-[var(--t-glow)] sm:text-4xl">
          {name}
        </h3>
        {description && <p className="mt-1.5 line-clamp-1 text-xs text-white/55">{description}</p>}
        {avgRating > 0 && (
          <span className="mt-2 inline-flex w-fit items-center gap-1 text-xs font-semibold text-yellow-300">
            <Star className="h-3.5 w-3.5" /> {avgRating.toFixed(1)} avg rating
          </span>
        )}
      </div>
    </Link>
  )
}
