import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WatchlistState {
  ids: string[]
  toggle: (id: string) => void
  add: (id: string) => void
  remove: (id: string) => void
  has: (id: string) => boolean
  clear: () => void
}

export const useWatchlist = create<WatchlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [id, ...s.ids],
        })),
      add: (id) => set((s) => (s.ids.includes(id) ? s : { ids: [id, ...s.ids] })),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    { name: 'heroreel-watchlist' },
  ),
)

interface RecentSearchesState {
  queries: string[]
  add: (q: string) => void
  remove: (q: string) => void
  clear: () => void
}

const MAX_RECENT = 8

export const useRecentSearches = create<RecentSearchesState>()(
  persist(
    (set) => ({
      queries: [],
      add: (q) =>
        set((s) => ({
          queries: [q, ...s.queries.filter((x) => x !== q)].slice(0, MAX_RECENT),
        })),
      remove: (q) => set((s) => ({ queries: s.queries.filter((x) => x !== q) })),
      clear: () => set({ queries: [] }),
    }),
    { name: 'heroreel-recent-searches' },
  ),
)
