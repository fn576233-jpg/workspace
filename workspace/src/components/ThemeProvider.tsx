import { useEffect } from 'react'
import type { ReactNode } from 'react'
import type { ColorTheme } from '../types'
import { DEFAULT_THEME, applyTheme, clearTheme } from '../lib/theme'

export function ThemeProvider({ theme, children }: { theme?: ColorTheme; children: ReactNode }) {
  useEffect(() => {
    applyTheme(theme ?? DEFAULT_THEME)
    return () => clearTheme()
  }, [theme])
  return <>{children}</>
}
