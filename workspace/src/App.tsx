import { useEffect, useMemo } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { getMovie } from './data'
import { ThemeProvider } from './components/ThemeProvider'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Home } from './pages/Home'
import { Movies } from './pages/Movies'
import { MovieDetail } from './pages/MovieDetail'
import { Characters } from './pages/Characters'
import { Franchises } from './pages/Franchises'
import { Years } from './pages/Years'
import { Watchlist } from './pages/Watchlist'
import { SearchPage } from './pages/SearchPage'
import { NotFound } from './pages/NotFound'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}

function Layout() {
  const location = useLocation()
  const theme = useMemo(() => {
    const m = location.pathname.match(/^\/movie\/([^/]+)/)
    return m ? getMovie(m[1])?.theme : undefined
  }, [location.pathname])

  return (
    <ThemeProvider theme={theme}>
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only rounded-full bg-[var(--t-primary)] px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="min-h-[70vh]">
        <ErrorBoundary>
          <RouteOutlet />
        </ErrorBoundary>
      </main>
      <Footer />
    </ThemeProvider>
  )
}

function RouteOutlet() {
  const location = useLocation()
  return (
    <div key={location.pathname} className="page-enter">
      <Routes location={location}>
        <Route index element={<Home />} />
        <Route path="movies" element={<Movies />} />
        <Route path="movie/:id" element={<MovieDetail />} />
        <Route path="characters" element={<Characters />} />
        <Route path="franchises" element={<Franchises />} />
        <Route path="years" element={<Years />} />
        <Route path="watchlist" element={<Watchlist />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
