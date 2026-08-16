export type MovieStatus = 'released' | 'upcoming'

export interface ColorTheme {
  primary: string
  secondary: string
  glow: string
  bgFrom: string
  bgVia: string
  bgTo: string
}

export type MotifType =
  | 'arc'
  | 'web'
  | 'nebula'
  | 'lightning'
  | 'shield'
  | 'vibranium'
  | 'rune'
  | 'lens'
  | 'energy'
  | 'void'
  | 'flame'
  | 'quantum'
  | 'claw'
  | 'sun'
  | 'techgrid'
  | 'wave'
  | 'skull'
  | 'scale'

export interface ArtConfig {
  motif: MotifType
  seed: string
}

export interface Movie {
  id: string
  title: string
  releaseDate: string
  year: number
  poster?: string
  backdrop?: string
  synopsis: string
  genres: string[]
  rating: number
  runtime: number
  cast: string[]
  director: string
  characters: string[]
  franchise: string
  universe: UniverseId
  trailer?: string
  status: MovieStatus
  theme: ColorTheme
  art: ArtConfig
}

export type UniverseId =
  | 'mcu'
  | 'xmen'
  | 'sony-spiderverse'
  | 'spiderverse-animated'
  | 'marvel-legacy'

export interface Universe {
  id: UniverseId
  name: string
  description: string
}
