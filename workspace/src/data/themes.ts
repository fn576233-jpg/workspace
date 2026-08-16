import type { ColorTheme } from '../types'

function pal(
  primary: string,
  secondary: string,
  glow: string,
  bgFrom: string,
  bgVia: string,
  bgTo: string,
): ColorTheme {
  return { primary, secondary, glow, bgFrom, bgVia, bgTo }
}

export const THEMES = {
  iron: pal('#ff8a3d', '#e62429', '#ff7a1a', '#3a0d02', '#1c0a14', '#050408'),
  starkTech: pal('#22d3ee', '#6366f1', '#38e8ff', '#061b2e', '#0a0f2e', '#050409'),
  hulk: pal('#4ade80', '#16a34a', '#5eff8f', '#03240f', '#071b22', '#04050a'),
  thor: pal('#00e5ff', '#7c4dff', '#38e8ff', '#041c2a', '#120a2e', '#050409'),
  ragnarok: pal('#f97316', '#a855f7', '#ff9a3d', '#2a0a12', '#1a0a2e', '#050409'),
  cap: pal('#4da8ff', '#ef4444', '#5cb8ff', '#041430', '#180a26', '#050409'),
  avengers: pal('#4da8ff', '#ffd700', '#6ab0ff', '#071630', '#231512', '#050409'),
  cosmic: pal('#a855f7', '#38bdf8', '#c084fc', '#160a33', '#0a142e', '#05040a'),
  guardians: pal('#2dd4bf', '#fb923c', '#5ef6e8', '#032522', '#2a1507', '#05040a'),
  spider: pal('#e62429', '#3b82f6', '#ff3b3b', '#1c0410', '#081430', '#050409'),
  wakanda: pal('#7c3aed', '#22d3ee', '#a78bfa', '#0e0620', '#05161f', '#050409'),
  mystic: pal('#c084fc', '#f43f5e', '#e879f9', '#140a2e', '#1f0a24', '#05040a'),
  endgame: pal('#fbbf24', '#f87171', '#fcd34d', '#241300', '#140a1e', '#050409'),
  widow: pal('#ef4444', '#94a3b8', '#ff5c5c', '#20070b', '#12141c', '#050409'),
  quantum: pal('#f43f5e', '#38bdf8', '#ff5c7a', '#1c0612', '#08182e', '#050409'),
  deadpool: pal('#ff3040', '#94a3b8', '#ff5c6a', '#260208', '#1a1a22', '#050409'),
  xmen: pal('#facc15', '#e11d48', '#ffe14d', '#221700', '#1c0512', '#050409'),
  wolverine: pal('#f59e0b', '#e11d48', '#ffb429', '#221203', '#1c0512', '#050409'),
  captainMarvel: pal('#3b82f6', '#ef4444', '#6aa8ff', '#081430', '#1c0512', '#050409'),
  eternals: pal('#fcd34d', '#fb7185', '#ffe08a', '#221800', '#1c0610', '#050409'),
  shangchi: pal('#ef4444', '#fbbf24', '#ff6b5c', '#260308', '#1e1006', '#050409'),
  fantastic: pal('#38bdf8', '#2dd4bf', '#6fd8ff', '#031a26', '#062420', '#050409'),
  blade: pal('#dc2626', '#64748b', '#ff3b3b', '#1c0206', '#10121a', '#04040a'),
  ghost: pal('#f97316', '#38bdf8', '#ff9a3d', '#200800', '#04121f', '#050409'),
  daredevil: pal('#dc2626', '#1e293b', '#ff4b4b', '#200409', '#120d16', '#04040a'),
  venom: pal('#38bdf8', '#64748b', '#67c8ff', '#031021', '#0c0c16', '#04040a'),
  silver: pal('#a1a1aa', '#3b82f6', '#c8c8d0', '#16161d', '#081018', '#040409'),
  legacy: pal('#d4a373', '#9a8c98', '#e2b48a', '#1c130a', '#140f18', '#040409'),
  wanda: pal('#f43f5e', '#8b5cf6', '#ff5c7a', '#1f0510', '#160a26', '#050409'),
  loki: pal('#10b981', '#f59e0b', '#34d399', '#04180f', '#161302', '#04040a'),
  ironheart: pal('#f472b6', '#38bdf8', '#f9a8d4', '#1f0614', '#081020', '#050409'),
  falcon: pal('#38bdf8', '#f43f5e', '#7dd3fc', '#02101f', '#1c0710', '#050409'),
  thunder: pal('#94a3b8', '#38bdf8', '#cbd5e1', '#0a0e16', '#071424', '#050409'),
  doom: pal('#4ade80', '#a3e635', '#86efac', '#02170c', '#0b0f0a', '#04040a'),
  newday: pal('#22c55e', '#ef4444', '#4ade80', '#041c10', '#200508', '#050409'),
} satisfies Record<string, ColorTheme>

export type ThemeKey = keyof typeof THEMES
