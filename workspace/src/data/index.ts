import type { Movie, Universe } from '../types'
import { MCU_MOVIES } from './movies-mcu'
import { CLASSIC_MOVIES } from './movies-classics'

export const MOVIES: Movie[] = [...MCU_MOVIES, ...CLASSIC_MOVIES]

export const UNIVERSES: Universe[] = [
  {
    id: 'mcu',
    name: 'Marvel Cinematic Universe',
    description: 'The interconnected saga of heroes that began with Iron Man in 2008 and became the biggest film franchise in history.',
  },
  {
    id: 'xmen',
    name: 'X-Men Universe',
    description: 'The saga of mutantkind from 20th Century Fox, following the X-Men, Wolverine, and the Merc with a Mouth.',
  },
  {
    id: 'sony-spiderverse',
    name: 'Sony Spider-Man Universe',
    description: 'Spider-Man and fellow Marvel characters brought to life by Sony Pictures, from the Raimi trilogy to Venom.',
  },
  {
    id: 'spiderverse-animated',
    name: 'Spider-Verse (Animated)',
    description: 'The groundbreaking, award-winning animated multiverse adventures of Miles Morales and the Spider-Society.',
  },
  {
    id: 'marvel-legacy',
    name: 'Marvel Legacy',
    description: 'Classic Marvel films from the pre-MCU era: Blade, Hulk, Daredevil, Ghost Rider, Punisher, and more.',
  },
]

export function getMovie(id: string): Movie | undefined {
  return MOVIES.find((m) => m.id === id)
}

export function getUniverse(id: string): Universe | undefined {
  return UNIVERSES.find((u) => u.id === id)
}

export function moviesByUniverse(id: string): Movie[] {
  return MOVIES.filter((m) => m.universe === id)
}

export interface FranchiseGroup {
  name: string
  count: number
  movies: Movie[]
  avgRating: number
}

export function franchises(): FranchiseGroup[] {
  const map = new Map<string, Movie[]>()
  for (const m of MOVIES) {
    const list = map.get(m.franchise) ?? []
    list.push(m)
    map.set(m.franchise, list)
  }
  return [...map.entries()]
    .map(([name, movies]) => ({
      name,
      count: movies.length,
      movies: movies.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate)),
      avgRating:
        movies.reduce((acc, m) => acc + (m.rating || 0), 0) / Math.max(1, movies.filter((m) => m.rating > 0).length),
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export interface CharacterGroup {
  name: string
  count: number
  movies: Movie[]
  avgRating: number
}

let charCacheAll: CharacterGroup[] | null = null

export function characters(): CharacterGroup[] {
  if (charCacheAll) return charCacheAll
  const map = new Map<string, Movie[]>()
  for (const m of MOVIES) {
    for (const c of m.characters) {
      const list = map.get(c) ?? []
      list.push(m)
      map.set(c, list)
    }
  }
  const groups = [...map.entries()]
    .map(([name, movies]) => ({
      name,
      count: movies.length,
      movies: movies.sort((a, b) => a.releaseDate.localeCompare(b.releaseDate)),
      avgRating: movies.reduce((acc, m) => acc + (m.rating || 0), 0) / Math.max(1, movies.filter((m) => m.rating > 0).length),
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  charCacheAll = groups
  return groups
}

export function moviesForCharacter(name: string): Movie[] {
  return characters().find((c) => c.name === name)?.movies ?? []
}

export function moviesForFranchise(name: string): Movie[] {
  return MOVIES.filter((m) => m.franchise === name).sort((a, b) => a.releaseDate.localeCompare(b.releaseDate))
}

function sharedGenres(a: Movie, b: Movie): number {
  return a.genres.filter((g) => b.genres.includes(g)).length
}

export function relatedMovies(movie: Movie, limit = 10): Movie[] {
  return MOVIES.filter((m) => m.id !== movie.id && m.status === 'released')
    .map((m) => ({
      m,
      score:
        sharedGenres(movie, m) * 4 +
        (m.franchise === movie.franchise ? 2 : 0) +
        (movie.rating > 0 && m.rating > 0 && Math.abs(m.rating - movie.rating) < 1.5 ? 1 : 0) +
        (m.year === movie.year ? 1 : 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.m.rating - a.m.rating)
    .slice(0, limit)
    .map((x) => x.m)
}

export function genres(): string[] {
  const set = new Set<string>()
  for (const m of MOVIES) for (const g of m.genres) set.add(g)
  return [...set].sort()
}

export function years(): number[] {
  const set = new Set<number>()
  for (const m of MOVIES) set.add(m.year)
  return [...set].sort((a, b) => b - a)
}

export const FEATURED_ID = 'avengers-endgame'

export const TRENDING_IDS = [
  'avengers-endgame',
  'avengers-infinity-war',
  'spider-man-no-way-home',
  'black-panther',
  'logan',
  'deadpool-and-wolverine',
  'spider-man-across-the-spider-verse',
  'spider-man-into-the-spider-verse',
  'thor-ragnarok',
  'guardians-of-the-galaxy',
  'guardians-of-the-galaxy-vol-3',
  'captain-america-the-winter-soldier',
  'doctor-strange',
  'captain-america-civil-war',
  'iron-man',
  'the-avengers',
  'x-men-days-of-future-past',
  'venom',
]

export function trending(): Movie[] {
  const map = new Map(MOVIES.map((m) => [m.id, m]))
  return TRENDING_IDS.map((id) => map.get(id)).filter((m): m is Movie => m !== undefined && m.status === 'released')
}

export const FEATURED_CHARACTERS = [
  'Tony Stark',
  'Steve Rogers',
  'Peter Parker',
  'Wolverine',
  'Thor',
  'T\u2019Challa',
  'Stephen Strange',
  'Bruce Banner',
  'Natasha Romanoff',
  'Deadpool',
  'Carol Danvers',
  'Miles Morales',
  'Star-Lord',
  'Loki',
  'Wanda Maximoff',
  'Shuri',
]

export function isClassic(m: Movie): boolean {
  return m.universe !== 'mcu' && m.status === 'released'
}

export function latest(): Movie[] {
  return MOVIES.filter((m) => m.status === 'released')
    .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))
    .slice(0, 12)
}

export function popular(): Movie[] {
  return MOVIES.filter((m) => m.status === 'released' && m.rating > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 12)
}

export function classics(): Movie[] {
  return MOVIES.filter(isClassic).sort((a, b) => b.year - a.year).slice(0, 12)
}

export function upcoming(): Movie[] {
  return MOVIES.filter((m) => m.status === 'upcoming').sort((a, b) => a.releaseDate.localeCompare(b.releaseDate))
}
