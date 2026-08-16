import type { ColorTheme } from '../types'

export const SITE_ACCENT = '#e62429'
export const SITE_ACCENT_HOVER = '#ff3b3b'

export const DEFAULT_THEME: ColorTheme = {
  primary: '#e62429',
  secondary: '#3b82f6',
  glow: '#ff3b3b',
  bgFrom: '#12050a',
  bgVia: '#0a0a14',
  bgTo: '#05060a',
}

export const THEME_VAR_KEYS = [
  '--t-primary',
  '--t-secondary',
  '--t-glow',
  '--t-bg-from',
  '--t-bg-via',
  '--t-bg-to',
] as const

export type ThemeVars = Record<(typeof THEME_VAR_KEYS)[number], string>

export function themeVars(t: ColorTheme): ThemeVars {
  return {
    '--t-primary': t.primary,
    '--t-secondary': t.secondary,
    '--t-glow': t.glow,
    '--t-bg-from': t.bgFrom,
    '--t-bg-via': t.bgVia,
    '--t-bg-to': t.bgTo,
  }
}

export function applyTheme(t: ColorTheme) {
  const vars = themeVars(t)
  const root = document.documentElement
  for (const [k, v] of Object.entries(vars)) {
    root.style.setProperty(k, v)
  }
}

export function clearTheme() {
  const root = document.documentElement
  for (const k of THEME_VAR_KEYS) {
    root.style.removeProperty(k)
  }
}
