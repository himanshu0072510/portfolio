import { useCallback, useEffect, useState } from 'react'
import { motionDisabled } from '../lib/motion'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'theme'

function readInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') return stored
  } catch {
    /* storage unavailable — fall through to the system preference */
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.classList.toggle('light', theme === 'light')
  root.style.colorScheme = theme
  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* storage unavailable — the theme still applies for this session */
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme)

  useEffect(() => {
    applyTheme(theme)
    // Only on mount: later changes are applied inside the crossfade.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = useCallback(() => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'

    if (motionDisabled()) {
      applyTheme(next)
      setTheme(next)
      return
    }

    // A crossfade, not a per-property tween. One complete layer of the new
    // ground washes over the page, the theme flips at the peak, and the wash
    // lifts to reveal it. Because the wash is opaque and the flip happens
    // underneath it, every property — including the ones that cannot
    // interpolate, like fonts and icons — blends at the same instant.
    const wash = document.createElement('div')
    wash.className = next
    wash.style.cssText = [
      'position:fixed',
      'inset:0',
      'z-index:9999',
      'pointer-events:none',
      'background:var(--bg)',
    ].join(';')
    document.body.appendChild(wash)

    const fadeIn = wash.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 150,
      easing: 'ease-in',
      fill: 'forwards',
    })

    fadeIn.onfinish = () => {
      applyTheme(next)
      setTheme(next)
      const fadeOut = wash.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 280,
        easing: 'ease-out',
        fill: 'forwards',
      })
      fadeOut.onfinish = () => wash.remove()
    }
  }, [theme])

  return { theme, toggle }
}
