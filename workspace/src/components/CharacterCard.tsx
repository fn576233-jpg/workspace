import { Link } from 'react-router-dom'
import type { Movie } from '../types'
import { MovieArt } from './MovieArt'
import { UsersIcon } from './icons'

interface Props {
  name: string
  count: number
  representative: Movie
}

export function CharacterCard({ name, count, representative }: Props) {
  return (
    <Link
      to={`/movies?character=${encodeURIComponent(name)}`}
      className="group relative block aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 shadow-lg shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:shadow-2xl hover:shadow-[color-mix(in_srgb,var(--t-glow)_22%,transparent)]"
      aria-label={`Movies featuring ${name}`}
    >
      <MovieArt
        motif={representative.art.motif}
        seed={`char-${representative.id}`}
        theme={representative.theme}
        variant="poster"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, transparent 45%, rgba(5,6,10,0.92) 100%)' }}
      />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-0.5 text-[11px] font-medium text-white/70 backdrop-blur">
          <UsersIcon className="h-3 w-3" />
          {count} {count === 1 ? 'film' : 'films'}
        </span>
        <h3 className="heading-display text-xl leading-tight text-white transition-colors group-hover:text-[var(--t-glow)]">
          {name}
        </h3>
      </div>
    </Link>
  )
}
