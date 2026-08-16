import { Link } from 'react-router-dom'
import { FilmIcon, Search } from './icons'
import { UNIVERSES, genres } from '../data'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/movies', label: 'Movies' },
  { to: '/characters', label: 'Characters' },
  { to: '/franchises', label: 'Franchises' },
  { to: '/years', label: 'Years' },
  { to: '/watchlist', label: 'Watchlist' },
]

export function Footer() {
  const topGenres = genres().slice(0, 8)

  return (
    <footer className="mt-20 border-t border-white/[0.06] bg-black/30 backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Hero Reel home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff3b3b] to-[#8f0f14] shadow-[0_4px_18px_-2px_rgba(230,36,41,0.7)]">
              <FilmIcon className="h-5 w-5 text-white" />
            </span>
            <span className="heading-display text-2xl text-white">
              HERO<span className="text-[var(--t-primary)]">REEL</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-white/55">
            A premium cinematic discovery universe for the complete Marvel film library — from the classics to the
            latest releases. Built for fans, by fans.
          </p>
          <Link
            to="/search"
            className="btn-ghost mt-5 px-4 py-2 text-sm"
          >
            <Search className="h-4 w-4" /> Discover movies
          </Link>
        </div>

        <nav aria-label="Footer navigation">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">Explore</h3>
          <ul className="mt-4 space-y-2.5">
            {NAV.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-white/65 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Universes">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">Universes</h3>
          <ul className="mt-4 space-y-2.5">
            {UNIVERSES.map((u) => (
              <li key={u.id}>
                <Link to={`/movies?universe=${u.id}`} className="text-sm text-white/65 transition-colors hover:text-white">
                  {u.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Genres">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">Genres</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {topGenres.map((g) => (
              <Link
                key={g}
                to={`/movies?genre=${encodeURIComponent(g)}`}
                className="rounded-full border border-white/12 px-3 py-1 text-xs text-white/60 transition hover:border-white/30 hover:text-white"
              >
                {g}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <div className="border-t border-white/[0.06] px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-xs text-white/40 md:flex-row md:text-left">
          <p>© {new Date().getFullYear()} HERO REEL. A fan-made movie discovery experience. All rights to their respective owners.</p>
          <p>For trailers and viewing options, we only link to official and licensed sources. No pirated content.</p>
        </div>
      </div>
    </footer>
  )
}
