import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

export const THEME_STORAGE_KEY = 'mg_theme'

export const THEME_COLORS = {
  dark: '#0b0612',
  light: '#faf8fd',
}

const ThemeContext = createContext(null)

/**
 * Synchronizes HTML element attributes, classes, colorScheme, and mobile browser theme-color.
 */
function applyThemeToDOM(theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
  if (theme === 'dark') {
    root.classList.add('dark')
    root.classList.remove('light')
  } else {
    root.classList.add('light')
    root.classList.remove('dark')
  }
  root.style.colorScheme = theme

  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', THEME_COLORS[theme] || THEME_COLORS.dark)
  }
}

/**
 * Resolves initial theme state seamlessly from the DOM attribute already set by the zero-FOUC script.
 */
function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'

  // 1. Prioritize DOM attribute populated by zero-FOUC head script
  const domTheme = document.documentElement.getAttribute('data-theme')
  if (domTheme === 'light' || domTheme === 'dark') {
    return domTheme
  }

  // 2. Read from localStorage
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') {
      return stored
    }
  } catch (e) {
    // LocalStorage blocked
  }

  // 3. Fallback to OS system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }

  // 4. Default: Dark Purple identity
  return 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme)

  const setTheme = useCallback((newTheme) => {
    const resolved = newTheme === 'light' ? 'light' : 'dark'
    setThemeState(resolved)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, resolved)
    } catch (e) {}
    applyThemeToDOM(resolved)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next)
      } catch (e) {}
      applyThemeToDOM(next)
      return next
    })
  }, [])

  // Sync DOM on mount and updates
  useEffect(() => {
    applyThemeToDOM(theme)
  }, [theme])

  // Listen to OS system theme changes if user hasn't set an explicit preference
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemChange = (e) => {
      try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY)
        if (!stored) {
          const systemTheme = e.matches ? 'dark' : 'light'
          setThemeState(systemTheme)
          applyThemeToDOM(systemTheme)
        }
      } catch (err) {}
    }

    if (mql.addEventListener) {
      mql.addEventListener('change', handleSystemChange)
    } else if (mql.addListener) {
      mql.addListener(handleSystemChange)
    }

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handleSystemChange)
      } else if (mql.removeListener) {
        mql.removeListener(handleSystemChange)
      }
    }
  }, [])

  // Cross-tab synchronization
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === THEME_STORAGE_KEY && (e.newValue === 'light' || e.newValue === 'dark')) {
        setThemeState(e.newValue)
        applyThemeToDOM(e.newValue)
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const contextValue = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      isLight: theme === 'light',
      toggleTheme,
      setTheme,
    }),
    [theme, toggleTheme, setTheme],
  )

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
