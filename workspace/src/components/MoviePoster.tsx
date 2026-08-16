import type { Movie } from '../types'
import { MovieArt } from './MovieArt'

interface Props {
  movie: Movie
  variant: 'poster' | 'backdrop'
  className?: string
  eager?: boolean
}

export function MoviePoster({ movie, variant, className, eager }: Props) {
  if (movie.poster || movie.backdrop) {
    const src = variant === 'poster' ? movie.poster : movie.backdrop
    return (
      <img
        src={src}
        alt=""
        className={className}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    )
  }
  return (
    <MovieArt
      motif={movie.art.motif}
      seed={movie.art.seed}
      theme={movie.theme}
      variant={variant}
      className={className}
    />
  )
}
