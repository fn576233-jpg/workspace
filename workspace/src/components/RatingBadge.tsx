import { Star } from './icons'

interface Props {
  rating: number
  className?: string
}

export function RatingBadge({ rating, className = '' }: Props) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${className}`}>
      <Star className="h-3.5 w-3.5 text-yellow-300" />
      <span className="text-white">{rating ? rating.toFixed(1) : 'TBA'}</span>
      {rating ? <span className="text-white/50">/ 10</span> : null}
    </span>
  )
}
