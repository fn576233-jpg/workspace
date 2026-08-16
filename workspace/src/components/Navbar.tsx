import { useEffect, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useWatchlist } from '../lib/store'
import { Bookmark, LayersIcon, MenuIcon, Search, UsersIcon, XIcon, Calendar, FilmIcon, GlobeIcon } from './icons'
import { SearchOverlay } from './SearchOverlay'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/movies', label: 'Movies' },
  { to: '/characters', label: 'Characters' },
  { to: '/franchises', label: 'Franchises' },
  { to: '/years', label: 'Years' },
  { to: '/watchlist', label: 'Watchlist' },
]

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const watchCount = useWatchlist((s) => s.ids.length)
  const location = useLocation()

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setDrawerOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = searchOpen || drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [searchOpen, drawerOpen])

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-black/55 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Primary">
          <Link to="/" className="flex items-center gap-2.5" aria-label="Hero Reel home">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff3b3b] to-[#8f0f14] shadow-[0_4px_18px_-2px_rgba(230,36,41,0.7)]">
              <FilmIcon className="h-5 w-5 text-white" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-white/90" />
            </span>
            <span className="heading-display text-2xl tracking-wide text-white">
              HERO<span className="text-[var(--t-primary)]">REEL</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-sm text-white/70 backdrop-blur transition hover:border-white/30 hover:text-white"
              aria-label="Open search"
            >
              <Search className="h-4 w-4" />
              <span className="hidden md:inline">Search movies…</span>
            </button>

            <NavLink
              to="/watchlist"
              className={({ isActive }) =>
                `relative hidden items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors sm:inline-flex ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'
                }`
              }
            >
              <Bookmark className="h-4 w-4" />
              <span className="hidden md:inline">Watchlist</span>
              {watchCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--t-primary)] px-1 text-[11px] font-bold text-white">
                  {watchCount}
                </span>
              )}
            </NavLink>

            <button
              type="button"
              onClick={() => setDrawerOpen((v) => !v)}
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 text-white lg:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={drawerOpen}
            >
              {drawerOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 h-full w-full cursor-default bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="glass-strong absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col gap-1 overflow-y-auto p-6 animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
              <span className="heading-display text-2xl text-white">
                HERO<span className="text-[var(--t-primary)]">REEL</span>
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/15 text-white"
                aria-label="Close navigation"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setDrawerOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    isActive ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <NavIcon to={l.to} />
                {l.label}
                {l.to === '/watchlist' && watchCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--t-primary)] px-1 text-[11px] font-bold text-white">
                    {watchCount}
                  </span>
                )}
              </NavLink>
            ))}

            <button
              type="button"
              onClick={() => {
                setDrawerOpen(false)
                setSearchOpen(true)
              }}
              className="mt-2 flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-base font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Search className="h-5 w-5" />
              Search
            </button>
          </div>
        </div>
      )}

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  )
}

function NavIcon({ to }: { to: string }) {
  const cls = 'h-5 w-5'
  if (to === '/movies') return <FilmIcon className={cls} />
  if (to === '/characters') return <UsersIcon className={cls} />
  if (to === '/franchises') return <LayersIcon className={cls} />
  if (to === '/years') return <Calendar className={cls} />
  if (to === '/watchlist') return <Bookmark className={cls} />
  if (to === '/') return <GlobeIcon className={cls} />
  return null
}
