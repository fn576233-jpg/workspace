import type { Movie } from '../types'
import { slugify } from './format'

export interface OfficialSource {
  label: string
  url: string
  note: string
}

export function officialSources(movie: Movie): OfficialSource[] {
  const sources: OfficialSource[] = []
  const title = encodeURIComponent(movie.title)

  sources.push({
    label: 'Marvel.com',
    url: 'https://www.marvel.com/movies',
    note: 'The official Marvel movies hub',
  })

  if (movie.universe === 'mcu' || movie.universe === 'xmen' || movie.status === 'upcoming') {
    sources.push({
      label: 'Disney+',
      url: `https://www.disneyplus.com/search?q=${title}`,
      note: movie.status === 'upcoming' ? 'Find official availability here when it releases' : 'Stream officially on Disney+',
    })
  }

  if (movie.universe === 'sony-spiderverse') {
    sources.push({
      label: 'Sony Pictures',
      url: `https://www.sonypictures.com/movies/${slugify(movie.title)}`,
      note: 'Official Sony Pictures page',
    })
  }

  sources.push({
    label: 'Rotten Tomatoes',
    url: `https://www.rottentomatoes.com/search?search=${title}`,
    note: 'Official review aggregation and details',
  })

  return sources
}
