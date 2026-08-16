import { MOVIES, TRENDING_IDS } from '../data'
import type { Movie } from '../types'

export type SortKey = 'newest' | 'oldest' | 'popularity' | 'rating' | 'title'

export interface MovieQuery {
  query?: string
  genre?: string
  franchise?: string
  character?: string
  year?: string
  universe?: string
  status?: 'all' | 'released' | 'upcoming'
}

const trendingRank = new Map(TRENDING_IDS.map((id, i) => [id, TRENDING_IDS.length - i]))

function popularityScore(m: Movie): number {
  const rank = trendingRank.get(m.id)
  return rank ? 10_000 + rank * 10 : m.rating * 100
}

export function searchScore(m: Movie, raw: string): number {
  const q = raw.trim().toLowerCase()
  if (!q) return 0
  const title = m.title.toLowerCase()
  if (title === q) return 1000
  if (title.startsWith(q)) return 900
  if (title.includes(q)) return 700
  if (m.characters.some((c) => c.toLowerCase().includes(q))) return 550
  if (m.cast.some((c) => c.toLowerCase().includes(q))) return 480
  if (m.franchise.toLowerCase().includes(q)) return 400
  if (m.genres.some((g) => g.toLowerCase().includes(q))) return 350
  if (m.synopsis.toLowerCase().includes(q)) return 80
  return 0
}

export function searchMovies(query: string, limit = 12): Movie[] {
  const q = query.trim()
  if (!q) return []
  return MOVIES.filter((m) => searchScore(m, q) > 0)
    .sort((a, b) => searchScore(b, q) - searchScore(a, q) || popularityScore(b) - popularityScore(a))
    .slice(0, limit)
}

export function filterMovies(q: MovieQuery): Movie[] {
  let list = MOVIES
  if (q.genre) list = list.filter((m) => m.genres.includes(q.genre as string))
  if (q.franchise) list = list.filter((m) => m.franchise === q.franchise)
  if (q.character) list = list.filter((m) => m.characters.includes(q.character as string))
  if (q.year) list = list.filter((m) => String(m.year) === String(q.year))
  if (q.universe) list = list.filter((m) => m.universe === q.universe)
  if (q.status && q.status !== 'all') list = list.filter((m) => m.status === q.status)
  return list
}

export function sortMovies(list: Movie[], key: SortKey): Movie[] {
  const sorted = [...list]
  switch (key) {
    case 'newest':
      return sorted.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate) || b.rating - a.rating)
    case 'oldest':
      return sorted.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate) || b.rating - a.rating)
    case 'popularity':
      return sorted.sort((a, b) => popularityScore(b) - popularityScore(a))
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0) || b.year - a.year)
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))
  }
}
