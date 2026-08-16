import type { Movie } from '../types'
import { MovieCard } from './MovieCard'
import { Reveal } from './Reveal'

interface Props {
  movies: Movie[]
  className?: string
  eagerFrom?: number
}

export function MovieGrid({ movies, className = '', eagerFrom = 0 }: Props) {
  if (movies.length === 0) return null
  return (
    <div className={`grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5 ${className}`}>
      {movies.map((m, i) => (
        <Reveal key={m.id} delay={(i % 5) * 60}>
          <MovieCard movie={m} eager={i < eagerFrom} />
        </Reveal>
      ))}
    </div>
  )
}
