# Movie Discovery Website — Design Spec

**Date:** 2026-08-16
**Status:** Approved

A premium, immersive movie discovery platform for the complete Marvel film catalog
(MCU + classic pre-MCU films), inspired by a cinematic superhero aesthetic but built
as an original visual system and implementation.

## Decisions

- **Stack:** Vite + React 18 + TypeScript + Tailwind CSS (v4, Vite plugin) + React Router.
  Minimal dependencies; no component UI library.
- **Imagery:** Original, deterministic procedural art per movie (themed gradients +
  SVG motifs). No copyrighted assets. The `poster` / `backdrop` fields remain
  URL-capable so real art can be added later without schema changes.
- **Catalog scope:** All MCU films (2008–2026, incl. upcoming) plus classic pre-MCU
  Marvel films (Blade, X-Men saga, Spider-Man trilogies, Fantastic Four, Hulk,
  Daredevil, Ghost Rider, Punisher, etc.). ~70 titles.
- **Trailers:** Official studio YouTube embeds (youtube-nocookie), verified against
  YouTube's public oEmbed endpoint. Movies without a verified trailer show an
  official-source link panel instead.

## Architecture

Component-based React SPA. Clean separation: `data/` (typed dataset + derived
lists), `lib/` (pure search/filter/sort/format utilities + store), `hooks/`,
`components/` (reusable UI), `pages/` (routes).

### Data model

`Movie`: `id, title, releaseDate, year, poster, backdrop, synopsis, genres, rating,
runtime, cast, director, characters, franchise, universe, trailer, status, colorTheme,
art` where `art` holds the generative-art seed/motif and `colorTheme` holds
primary/secondary/glow/background gradient stops.

### Theming

A `ThemeProvider` applies per-movie CSS custom properties (background gradients,
glow color, accent borders, hero overlay) to the document. Movie detail pages adapt
their atmosphere per movie; site-wide CTAs stay consistent red. Reverts to a default
cinematic theme on non-movie pages.

### Generative art

`Poster` / `Backdrop` components render deterministic layered SVG: themed gradients,
grain, glow orbs, and a per-movie motif (webbing, arc-reactor rings, lightning,
vibranium geometry, mystic runes, nebula, etc.). Same seed always produces the same
image.

### State

- **Watchlist:** localStorage-persisted store (Zustand), add/remove/toggle, counts in
  nav.
- **Search:** pure-function index over title/cast/characters/franchise/genre; recent
  searches persisted to localStorage.
- **UI state:** filters, sort, pagination local to the Movies page via URL params.

## Pages & sections

- **Home:** hero (featured movie), trending carousel, latest releases, popular,
  classics, franchise/universe rows, year groups, character collections, genres,
  discovery/search, footer.
- **Movies:** full catalog, search, filters (year, genre, franchise, character,
  status), sort (newest, oldest, popularity, rating, title), clear-all, empty state,
  skeletons, pagination.
- **Movie Detail:** themed backdrop hero, poster, metadata, synopsis, cast, director,
  characters, trailer section, related movies, same-franchise movies, watchlist
  toggle, back navigation.
- **Characters, Franchises, Years, Watchlist, Search, 404:** dedicated pages.

## Cross-cutting

- Responsive: desktop / tablet / mobile; mobile nav drawer.
- Accessibility: semantic HTML, keyboard navigation, focus states, `aria` labels,
  `prefers-reduced-motion` respected.
- Loading skeletons, error boundary + error states, empty states everywhere.
- SEO: per-page `document.title` + meta description hook.
- Lazy loading for below-fold imagery; performance-focused.
