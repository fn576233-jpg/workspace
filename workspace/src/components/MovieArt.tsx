import type { ReactElement, ReactNode } from 'react'
import type { ColorTheme, MotifType } from '../types'
import { hashString, seededRand } from '../lib/rng'

export type ArtVariant = 'poster' | 'backdrop'

interface Ctx {
  rng: () => number
  theme: ColorTheme
  w: number
  h: number
  uid: string
}

type MotifFn = (ctx: Ctx) => ReactNode[]

const M = {
  arc: (ctx) => [
    <Glow key="g" ctx={ctx} cx={ctx.w / 2} cy={ctx.h / 2} r={Math.min(ctx.w, ctx.h) * 0.42} />,
    <circle key="c0" cx={ctx.w / 2} cy={ctx.h / 2} r={Math.min(ctx.w, ctx.h) * 0.3} fill="none" stroke={ctx.theme.primary} strokeWidth="3" opacity="0.9" />,
    ...rings(ctx, 6, 0.34, 0.2),
    ...ticks(ctx, 72, 0.32, 0.37),
    <circle key="core" cx={ctx.w / 2} cy={ctx.h / 2} r={Math.min(ctx.w, ctx.h) * 0.08} fill={ctx.theme.glow} opacity="0.95" />,
    <circle key="core2" cx={ctx.w / 2} cy={ctx.h / 2} r={Math.min(ctx.w, ctx.h) * 0.05} fill="#fff" opacity="0.8" />,
  ],
  web: (ctx) => {
    const cx = ctx.w * 0.5
    const cy = ctx.h * 0.44
    const R = Math.max(ctx.w, ctx.h)
    const spokes = 8
    const arcs = 7
    return [
      <Glow key="g" ctx={ctx} cx={cx} cy={cy} r={Math.min(ctx.w, ctx.h) * 0.4} />,
      <circle key="hub" cx={cx} cy={cy} r={6} fill={ctx.theme.primary} opacity="0.9" />,
      ...Array.from({ length: spokes }, (_, i) => {
        const a = (i / spokes) * Math.PI * 2
        return (
          <line
            key={`sp-${i}`}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(a) * R}
            y2={cy + Math.sin(a) * R}
            stroke={ctx.theme.primary}
            strokeWidth="1"
            opacity="0.5"
          />
        )
      }),
      ...Array.from({ length: arcs }, (_, i) => (
        <circle
          key={`ar-${i}`}
          cx={cx}
          cy={cy}
          r={(i + 1) * (R / arcs) * 0.55}
          fill="none"
          stroke={ctx.theme.secondary}
          strokeWidth="1.2"
          opacity="0.45"
        />
      )),
      ...stars(ctx, 26, 0.2, 0.5, cx, cy, R),
      <circle key="spider" cx={cx + 0.2 * Math.min(ctx.w, ctx.h) * (ctx.rng() - 0.5) * 2} cy={cy + 0.2 * Math.min(ctx.w, ctx.h) * (ctx.rng() - 0.5) * 2} r={5} fill={ctx.theme.primary} opacity="0.8" />,
    ]
  },
  nebula: (ctx) => [
    <NebulaGradient key="g" ctx={ctx} />,
    <Glow key="g1" ctx={ctx} cx={ctx.w * 0.3} cy={ctx.h * 0.35} r={Math.min(ctx.w, ctx.h) * 0.45} color={ctx.theme.primary} />,
    <Glow key="g2" ctx={ctx} cx={ctx.w * 0.72} cy={ctx.h * 0.6} r={Math.min(ctx.w, ctx.h) * 0.4} color={ctx.theme.secondary} />,
    <Glow key="g3" ctx={ctx} cx={ctx.w * 0.55} cy={ctx.h * 0.2} r={Math.min(ctx.w, ctx.h) * 0.3} color={ctx.theme.glow} />,
    ...streaks(ctx, 4, 0.5, 0.12),
    ...stars(ctx, 60, 0.15, 0.9, ctx.w / 2, ctx.h / 2, Math.max(ctx.w, ctx.h)),
    ...rings(ctx, 3, 0.75, 0.28),
  ],
  lightning: (ctx) => {
    const bolts = []
    for (let i = 0; i < 4; i++) {
      const x = ctx.w * (0.2 + ctx.rng() * 0.6)
      let points = `M${x},0`
      let px = x
      let py = 0
      const segs = 5 + Math.floor(ctx.rng() * 3)
      let dir = 1
      for (let s = 0; s < segs; s++) {
        py += ctx.h / segs + ctx.rng() * ctx.h * 0.06
        px += dir * (8 + ctx.rng() * 30)
        dir = -dir
        points += ` L${px},${py}`
      }
      bolts.push(
        <polyline
          key={`b-${i}`}
          points={points}
          fill="none"
          stroke={ctx.theme.glow}
          strokeWidth="3"
          opacity={0.85}
          strokeLinecap="round"
          strokeLinejoin="round"
        />,
      )
      bolts.push(<circle key={`e-${i}`} cx={px} cy={py} r={10 + ctx.rng() * 14} fill={ctx.theme.glow} opacity="0.25" />)
    }
    return [<Glow key="g" ctx={ctx} cx={ctx.w / 2} cy={ctx.h * 0.35} r={Math.min(ctx.w, ctx.h) * 0.4} />, ...bolts]
  },
  shield: (ctx) => {
    const cx = ctx.w / 2
    const cy = ctx.h / 2
    const r = Math.min(ctx.w, ctx.h) * 0.32
    const star = starPath(cx, cy, r * 0.55, r * 0.22, 5, ctx.rng)
    return [
      <Glow key="g" ctx={ctx} cx={cx} cy={cy} r={r * 1.5} />,
      <circle key="c1" cx={cx} cy={cy} r={r} fill="none" stroke={ctx.theme.primary} strokeWidth="4" opacity="0.9" />,
      <circle key="c2" cx={cx} cy={cy} r={r * 0.82} fill="none" stroke={ctx.theme.secondary} strokeWidth="1.5" opacity="0.7" />,
      <circle key="c3" cx={cx} cy={cy} r={r * 0.68} fill="none" stroke={ctx.theme.secondary} strokeWidth="1" opacity="0.5" />,
      <path key="star" d={star} fill={ctx.theme.glow} opacity="0.85" />,
      ...ticks(ctx, 48, r * 0.84, r * 0.92),
    ]
  },
  vibranium: (ctx) => {
    const els: ReactNode[] = []
    const rows = 9
    const cols = ctx.w > ctx.h ? 14 : 7
    const cw = ctx.w / cols
    const ch = ctx.h / rows
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cw
        const y = r * ch
        const flip = (r + c) % 2 === 0
        const o = 0.12 + ctx.rng() * 0.22
        const col = ctx.rng() > 0.5 ? ctx.theme.primary : ctx.theme.secondary
        els.push(
          <path
            key={`t-${r}-${c}`}
            d={flip ? `M${x},${y + ch} L${x + cw / 2},${y} L${x + cw},${y + ch} Z` : `M${x},${y} L${x + cw / 2},${y + ch} L${x + cw},${y} Z`}
            fill="none"
            stroke={col}
            strokeWidth="1"
            opacity={o}
          />,
        )
      }
    }
    return [<Glow key="g" ctx={ctx} cx={ctx.w / 2} cy={ctx.h / 2} r={Math.min(ctx.w, ctx.h) * 0.4} />, ...els, <Glow key="g2" ctx={ctx} cx={ctx.w * 0.7} cy={ctx.h * 0.3} r={Math.min(ctx.w, ctx.h) * 0.2} color={ctx.theme.glow} />]
  },
  rune: (ctx) => {
    const els: ReactNode[] = []
    for (let i = 0; i < 5; i++) {
      const cx = ctx.w * (0.15 + ctx.rng() * 0.7)
      const cy = ctx.h * (0.15 + ctx.rng() * 0.7)
      const rr = 18 + ctx.rng() * 30
      els.push(<circle key={`r-${i}`} cx={cx} cy={cy} r={rr} fill="none" stroke={ctx.theme.glow} strokeWidth="1.2" opacity="0.5" />)
      els.push(<g key={`g-${i}`} stroke={ctx.theme.primary} strokeWidth="2" opacity="0.7">{runeGlyph(cx, cy, rr, ctx.rng)}</g>)
    }
    return [<Glow key="bg" ctx={ctx} cx={ctx.w / 2} cy={ctx.h / 2} r={Math.min(ctx.w, ctx.h) * 0.45} />, ...els, ...stars(ctx, 30, 0.2, 0.8, ctx.w / 2, ctx.h / 2, Math.max(ctx.w, ctx.h))]
  },
  lens: (ctx) => {
    const cx = ctx.w / 2
    const cy = ctx.h / 2
    const rx = Math.min(ctx.w, ctx.h) * 0.35
    const ry = rx * 1.1
    return [
      <Glow key="g" ctx={ctx} cx={cx} cy={cy} r={rx * 1.4} />,
      <ellipse key="e1" cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={ctx.theme.primary} strokeWidth="2" opacity="0.85" />,
      <ellipse key="e2" cx={cx} cy={cy} rx={rx * 0.7} ry={ry * 0.7} fill="none" stroke={ctx.theme.secondary} strokeWidth="1.5" opacity="0.6" />,
      <ellipse key="iris" cx={cx} cy={cy} rx={rx * 0.35} ry={ry * 0.35} fill={ctx.theme.glow} opacity="0.7" />,
      <circle key="pupil" cx={cx} cy={cy} r={Math.min(rx, ry) * 0.16} fill="#05060a" opacity="0.9" />,
      ...Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2
        return <line key={`ln-${i}`} x1={cx + Math.cos(a) * rx * 0.95} y1={cy + Math.sin(a) * ry * 0.95} x2={cx + Math.cos(a) * rx * 1.25} y2={cy + Math.sin(a) * ry * 1.25} stroke={ctx.theme.primary} strokeWidth="1" opacity="0.4" />
      }),
    ]
  },
  energy: (ctx) => {
    const cx = ctx.w / 2
    const cy = ctx.h / 2
    const rays: ReactNode[] = []
    const count = 24
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2
      const spread = 0.85 + ctx.rng() * 0.3
      rays.push(
        <line key={`ray-${i}`} x1={cx + Math.cos(a) * Math.min(ctx.w, ctx.h) * 0.08} y1={cy + Math.sin(a) * Math.min(ctx.w, ctx.h) * 0.08} x2={cx + Math.cos(a) * Math.min(ctx.w, ctx.h) * 0.42 * spread} y2={cy + Math.sin(a) * Math.min(ctx.w, ctx.h) * 0.42 * spread} stroke={ctx.theme.glow} strokeWidth={2 + ctx.rng() * 2} opacity="0.5" strokeLinecap="round" />,
      )
    }
    return [
      <Glow key="g" ctx={ctx} cx={cx} cy={cy} r={Math.min(ctx.w, ctx.h) * 0.4} />,
      ...rays,
      <circle key="core" cx={cx} cy={cy} r={Math.min(ctx.w, ctx.h) * 0.16} fill={ctx.theme.glow} opacity="0.5" />,
      <circle key="core2" cx={cx} cy={cy} r={Math.min(ctx.w, ctx.h) * 0.09} fill="#fff" opacity="0.85" />,
    ]
  },
  void: (ctx) => {
    const cx = ctx.w / 2
    const cy = ctx.h / 2
    const swirls: ReactNode[] = []
    for (let i = 0; i < 5; i++) {
      const r = Math.min(ctx.w, ctx.h) * (0.1 + i * 0.07)
      const phase = ctx.rng() * Math.PI
      let d = `M${cx + Math.cos(phase) * r},${cy + Math.sin(phase) * r}`
      for (let t = 0; t < 6; t++) {
        const a = phase + (t / 6) * Math.PI * 2
        d += ` A${r},${r} 0 0 1 ${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`
      }
      swirls.push(<path key={`sw-${i}`} d={d} fill="none" stroke={ctx.theme.secondary} strokeWidth="1.5" opacity={0.35 - i * 0.05} />)
    }
    return [<Glow key="g" ctx={ctx} cx={cx} cy={cy} r={Math.min(ctx.w, ctx.h) * 0.5} />, ...swirls, ...tendrils(ctx, 6), ...stars(ctx, 20, 0.2, 0.7, cx, cy, Math.max(ctx.w, ctx.h) * 0.6)]
  },
  flame: (ctx) => {
    const flames: ReactNode[] = []
    for (let i = 0; i < 6; i++) {
      const x = ctx.w * (0.15 + ctx.rng() * 0.7)
      const w = 20 + ctx.rng() * 40
      const hgt = 60 + ctx.rng() * 120
      const baseY = ctx.h * (0.55 + ctx.rng() * 0.4)
      flames.push(
        <path
          key={`fl-${i}`}
          d={`M${x - w / 2},${baseY} Q${x - w * 0.2},${baseY - hgt * 0.6} ${x},${baseY - hgt} Q${x + w * 0.2},${baseY - hgt * 0.6} ${x + w / 2},${baseY} Q${x},${baseY + 6} ${x - w / 2},${baseY} Z`}
          fill={ctx.theme.glow}
          opacity={0.25 + ctx.rng() * 0.3}
        />,
      )
    }
    return [<Glow key="g" ctx={ctx} cx={ctx.w / 2} cy={ctx.h * 0.75} r={Math.min(ctx.w, ctx.h) * 0.45} />, ...flames, ...embers(ctx, 24)]
  },
  quantum: (ctx) => {
    const els: ReactNode[] = []
    const hexR = Math.min(ctx.w, ctx.h) * 0.11
    const cols = Math.ceil(ctx.w / (hexR * 1.8)) + 1
    const rows = Math.ceil(ctx.h / (hexR * 1.6)) + 1
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * hexR * 1.8 + (r % 2 ? hexR * 0.9 : 0)
        const y = r * hexR * 1.6
        const o = 0.14 + ctx.rng() * 0.18
        const col = ctx.rng() > 0.5 ? ctx.theme.primary : ctx.theme.secondary
        els.push(<polygon key={`h-${r}-${c}`} points={hexPoints(x, y, hexR)} fill="none" stroke={col} strokeWidth="1" opacity={o} />)
        if (ctx.rng() > 0.75) els.push(<circle key={`n-${r}-${c}`} cx={x} cy={y} r={2.2} fill={ctx.theme.glow} opacity="0.7" />)
      }
    }
    return [<Glow key="g" ctx={ctx} cx={ctx.w / 2} cy={ctx.h / 2} r={Math.min(ctx.w, ctx.h) * 0.4} />, ...els]
  },
  claw: (ctx) => {
    const slashes: ReactNode[] = []
    for (let i = 0; i < 6; i++) {
      const x = ctx.w * (0.15 + ctx.rng() * 0.7)
      const y = ctx.h * (0.15 + ctx.rng() * 0.7)
      const len = 80 + ctx.rng() * 120
      const a = -0.6 + ctx.rng() * 1.2
      slashes.push(
        <line key={`s-${i}`} x1={x} y1={y} x2={x + Math.cos(a) * len} y2={y + Math.sin(a) * len} stroke={ctx.theme.glow} strokeWidth={4 + ctx.rng() * 3} strokeLinecap="round" opacity="0.5" />,
      )
    }
    return [<Glow key="g" ctx={ctx} cx={ctx.w / 2} cy={ctx.h / 2} r={Math.min(ctx.w, ctx.h) * 0.45} />, ...slashes, ...stars(ctx, 18, 0.2, 0.7, ctx.w / 2, ctx.h / 2, Math.max(ctx.w, ctx.h))]
  },
  sun: (ctx) => {
    const cx = ctx.w / 2
    const cy = ctx.h * 0.42
    const R = Math.min(ctx.w, ctx.h) * 0.3
    return [
      <Glow key="g" ctx={ctx} cx={cx} cy={cy} r={R * 1.6} color={ctx.theme.glow} />,
      <circle key="disc" cx={cx} cy={cy} r={R} fill="none" stroke={ctx.theme.glow} strokeWidth="1" opacity="0.8" />,
      <circle key="disc2" cx={cx} cy={cy} r={R * 0.86} fill={ctx.theme.glow} opacity="0.12" />,
      ...Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2
        const r1 = R * (0.95 + (i % 2) * 0.12)
        const r2 = R * (1.1 + (i % 3) * 0.12)
        return <line key={`ray-${i}`} x1={cx + Math.cos(a) * r1} y1={cy + Math.sin(a) * r1} x2={cx + Math.cos(a) * r2} y2={cy + Math.sin(a) * r2} stroke={ctx.theme.glow} strokeWidth="2" opacity="0.6" />
      }),
      <Glow key="g2" ctx={ctx} cx={cx} cy={cy} r={R * 0.5} color="#fff" />,
    ]
  },
  techgrid: (ctx) => {
    const els: ReactNode[] = []
    const step = Math.min(ctx.w, ctx.h) * 0.1
    for (let x = 0; x <= ctx.w; x += step) {
      els.push(<line key={`v-${x}`} x1={x} y1={0} x2={x} y2={ctx.h} stroke={ctx.theme.secondary} strokeWidth="0.7" opacity="0.18" />)
    }
    for (let y = 0; y <= ctx.h; y += step) {
      els.push(<line key={`h-${y}`} x1={0} y1={y} x2={ctx.w} y2={y} stroke={ctx.theme.secondary} strokeWidth="0.7" opacity="0.18" />)
    }
    for (let x = step; x < ctx.w; x += step) {
      for (let y = step; y < ctx.h; y += step) {
        if (ctx.rng() > 0.6) els.push(<circle key={`d-${x}-${y}`} cx={x} cy={y} r={2} fill={ctx.theme.glow} opacity="0.55" />)
      }
    }
    return [<Glow key="g" ctx={ctx} cx={ctx.w * 0.75} cy={ctx.h * 0.3} r={Math.min(ctx.w, ctx.h) * 0.4} />, ...els]
  },
  wave: (ctx) => {
    const waves: ReactNode[] = []
    for (let i = 0; i < 3; i++) {
      const y = ctx.h * (0.3 + i * 0.2)
      const amp = 18 + i * 8
      const freq = 2 + i
      let d = 'M0,' + y
      for (let x = 0; x <= ctx.w; x += 8) {
        d += ` L${x},${y + Math.sin((x / ctx.w) * Math.PI * 2 * freq + i) * amp}`
      }
      waves.push(<path key={`w-${i}`} d={d} fill="none" stroke={i % 2 ? ctx.theme.secondary : ctx.theme.glow} strokeWidth="1.6" opacity={0.55 - i * 0.12} />)
    }
    return [<Glow key="g" ctx={ctx} cx={ctx.w / 2} cy={ctx.h / 2} r={Math.min(ctx.w, ctx.h) * 0.45} />, ...waves, ...stars(ctx, 20, 0.2, 0.7, ctx.w / 2, ctx.h / 2, Math.max(ctx.w, ctx.h))]
  },
  skull: (ctx) => {
    const cx = ctx.w / 2
    const cy = ctx.h * 0.48
    const R = Math.min(ctx.w, ctx.h) * 0.24
    const skull = `M${cx - R * 0.75},${cy + R * 0.2}
      C${cx - R * 1.05},${cy - R * 0.6} ${cx - R * 0.4},${cy - R * 0.95} ${cx},${cy - R * 0.95}
      C${cx + R * 0.4},${cy - R * 0.95} ${cx + R * 1.05},${cy - R * 0.6} ${cx + R * 0.75},${cy + R * 0.2}
      L${cx + R * 0.45},${cy + R * 0.55} L${cx + R * 0.28},${cy + R * 1.15}
      L${cx - R * 0.28},${cy + R * 1.15} L${cx - R * 0.45},${cy + R * 0.55} Z`
    return [
      <Glow key="g" ctx={ctx} cx={cx} cy={cy} r={R * 1.7} />,
      <path key="skull" d={skull} fill="none" stroke={ctx.theme.glow} strokeWidth="2.4" opacity="0.85" strokeLinejoin="round" />,
      <ellipse key="eye1" cx={cx - R * 0.34} cy={cy - R * 0.18} rx={R * 0.17} ry={R * 0.22} fill={ctx.theme.glow} opacity="0.75" />,
      <ellipse key="eye2" cx={cx + R * 0.34} cy={cy - R * 0.18} rx={R * 0.17} ry={R * 0.22} fill={ctx.theme.glow} opacity="0.75" />,
      <path key="nose" d={`M${cx},${cy + R * 0.08} L${cx - R * 0.08},${cy + R * 0.28} L${cx + R * 0.08},${cy + R * 0.28} Z`} fill="none" stroke={ctx.theme.glow} strokeWidth="1.4" opacity="0.7" />,
    ]
  },
  scale: (ctx) => {
    const els: ReactNode[] = []
    const cols = ctx.w > ctx.h ? 12 : 6
    const rows = 10
    const cw = ctx.w / cols
    const ch = ctx.h / rows
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cw
        const y = r * ch + (c % 2 ? ch / 2 : 0)
        const o = 0.1 + ctx.rng() * 0.2
        els.push(
          <path key={`sc-${r}-${c}`} d={`M${x + 2},${y + ch * 0.8} Q${x + cw / 2},${y} ${x + cw - 2},${y + ch * 0.8}`} fill="none" stroke={ctx.theme.primary} strokeWidth="1.4" opacity={o} />,
        )
      }
    }
    return [<Glow key="g" ctx={ctx} cx={ctx.w / 2} cy={ctx.h * 0.7} r={Math.min(ctx.w, ctx.h) * 0.4} />, ...els]
  },
} satisfies Record<MotifType, MotifFn>

function hexPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = []
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6
    pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`)
  }
  return pts.join(' ')
}

function starPath(cx: number, cy: number, outer: number, inner: number, points: number, rng: () => number): string {
  const pts: string[] = []
  for (let i = 0; i < points * 2; i++) {
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2
    const r = i % 2 === 0 ? outer : inner * (0.85 + rng() * 0.3)
    pts.push(`${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`)
  }
  return pts.join(' ')
}

function rings(ctx: Ctx, count: number, max: number, min: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => {
    const r = Math.min(ctx.w, ctx.h) * (min + ((max - min) * i) / (count - 1))
    return <circle key={`ring-${i}`} cx={ctx.w / 2} cy={ctx.h / 2} r={r} fill="none" stroke={ctx.theme.secondary} strokeWidth="1.2" opacity={0.4 - i * 0.05} />
  })
}

function ticks(ctx: Ctx, count: number, r1: number, r2: number): ReactNode[] {
  const cx = ctx.w / 2
  const cy = ctx.h / 2
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2
    const sx = Math.min(ctx.w, ctx.h) * r1
    const ex = Math.min(ctx.w, ctx.h) * r2
    return <line key={`tick-${i}`} x1={cx + Math.cos(a) * sx} y1={cy + Math.sin(a) * sx} x2={cx + Math.cos(a) * ex} y2={cy + Math.sin(a) * ex} stroke={ctx.theme.glow} strokeWidth="1.4" opacity="0.55" />
  })
}

function stars(ctx: Ctx, count: number, minR: number, maxR: number, cx: number, cy: number, radius: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => {
    const a = ctx.rng() * Math.PI * 2
    const r = radius * Math.sqrt(ctx.rng())
    const r2 = minR + ctx.rng() * (maxR - minR)
    return <circle key={`star-${i}`} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r={r2} fill="#ffffff" opacity={0.25 + ctx.rng() * 0.6} />
  })
}

function streaks(ctx: Ctx, count: number, opacity: number, thickness: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => {
    const y = ctx.h * (0.2 + ctx.rng() * 0.6)
    const x1 = ctx.w * (0.1 + ctx.rng() * 0.3)
    const len = ctx.w * (0.3 + ctx.rng() * 0.4)
    const col = i % 2 ? ctx.theme.secondary : ctx.theme.primary
    return (
      <line
        key={`streak-${i}`}
        x1={x1}
        y1={y}
        x2={x1 + len}
        y2={y}
        stroke={col}
        strokeWidth={thickness}
        strokeLinecap="round"
        opacity={opacity * (0.4 + ctx.rng() * 0.6)}
      />
    )
  })
}

function tendrils(ctx: Ctx, count: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => {
    const x = ctx.w * (0.1 + ctx.rng() * 0.8)
    const y = ctx.h * (0.1 + ctx.rng() * 0.8)
    const d = `M${x},${y} C${x + (ctx.rng() - 0.5) * 200},${y + (ctx.rng() - 0.5) * 200} ${x + (ctx.rng() - 0.5) * 300},${y + (ctx.rng() - 0.5) * 300} ${x + (ctx.rng() - 0.5) * 260},${y + (ctx.rng() - 0.5) * 260}`
    return <path key={`tend-${i}`} d={d} fill="none" stroke={ctx.theme.secondary} strokeWidth="1.6" opacity="0.4" strokeLinecap="round" />
  })
}

function embers(ctx: Ctx, count: number): ReactNode[] {
  return Array.from({ length: count }, (_, i) => (
    <circle key={`ember-${i}`} cx={ctx.w * ctx.rng()} cy={ctx.h * (0.5 + ctx.rng() * 0.5)} r={1.4 + ctx.rng() * 3} fill={ctx.theme.glow} opacity={0.2 + ctx.rng() * 0.6} />
  ))
}

function runeGlyph(cx: number, cy: number, r: number, rng: () => number): ReactElement[] {
  const els: ReactElement[] = []
  const count = 3 + Math.floor(rng() * 3)
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + rng() * 0.5
    const inner = r * 0.45
    const x1 = cx + Math.cos(a) * inner
    const y1 = cy + Math.sin(a) * inner
    const x2 = cx + Math.cos(a) * r
    const y2 = cy + Math.sin(a) * r
    els.push(<line key={`gl-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="1.6" strokeLinecap="round" />)
  }
  return els
}

function Glow({ ctx, cx, cy, r, color }: { ctx: Ctx; cx: number; cy: number; r: number; color?: string }) {
  const c = color ?? ctx.theme.glow
  const id = `glow-${ctx.uid}-${c.replace(/[^a-z0-9]/gi, '')}`
  return (
    <>
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c} stopOpacity="0.5" />
          <stop offset="100%" stopColor={c} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#${id})`} opacity="0.55" />
    </>
  )
}

function NebulaGradient({ ctx }: { ctx: Ctx }) {
  const id = `nebula-${ctx.uid}`
  return (
    <radialGradient id={id} cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor={ctx.theme.glow} stopOpacity="0.55" />
      <stop offset="40%" stopColor={ctx.theme.primary} stopOpacity="0.25" />
      <stop offset="75%" stopColor={ctx.theme.secondary} stopOpacity="0.12" />
      <stop offset="100%" stopColor={ctx.theme.bgTo} stopOpacity="0" />
    </radialGradient>
  )
}

export function MovieArt({ motif, seed, theme, variant, className }: { motif: MotifType; seed: string; theme: ColorTheme; variant: ArtVariant; className?: string }) {
  const uid = `${seed}-${variant}`.replace(/[^a-zA-Z0-9_-]/g, '')
  const w = variant === 'backdrop' ? 1600 : 800
  const h = variant === 'backdrop' ? 900 : 1200
  const rng = seededRand(hashString(uid))
  const ctx: Ctx = { rng, theme, w, h, uid }
  const motifEls = M[motif]?.(ctx) ?? []

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={theme.bgFrom} />
          <stop offset="45%" stopColor={theme.bgVia} />
          <stop offset="100%" stopColor={theme.bgTo} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={theme.glow} stopOpacity="0.5" />
          <stop offset="100%" stopColor={theme.glow} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`vig-${uid}`} cx="50%" cy="50%" r="72%">
          <stop offset="60%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
        </radialGradient>
        <filter id={`noise-${uid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.05" />
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width={w} height={h} fill={`url(#bg-${uid})`} />
      <rect width={w} height={h} fill={`url(#glow-${uid})`} />
      {motifEls}
      <rect width={w} height={h} filter={`url(#noise-${uid})`} />
      <rect width={w} height={h} fill={`url(#vig-${uid})`} />
    </svg>
  )
}
