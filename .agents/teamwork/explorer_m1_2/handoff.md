# ThemeProvider & State Architecture Handoff Report

**Agent**: `explorer_m1_2`  
**Role**: Theme State Architect & Zero-FOUC Strategist  
**Milestone**: Milestone 1 (ThemeProvider & State Architecture)  
**Date**: 2026-10-31  
**Target Path**: `C:\Users\Windows11 Pro\Desktop\Projects\MaryGrace-Portfolio\.agents\teamwork\explorer_m1_2\handoff.md`

---

## 1. Observation

Direct observations from examining the codebase, configuration files, and architecture specifications:

1. **Vite Shell and Initial HTML**:
   - In `index.html` (lines 1–38):
     - Line 11: `<meta name="theme-color" content="#171021" />` is static.
     - Line 2: `<html lang="en">` has no initial `data-theme` attribute or theme class (`.dark` / `.light`).
     - Line 36: `<script type="module" src="/src/main.jsx"></script>` is loaded as an ES module, which is deferred by the browser.
     - There is currently **no inline script** in `<head>` to evaluate stored theme preferences before rendering occurs.
2. **Current Entry Point & State**:
   - In `src/main.jsx` (lines 1–11):
     ```jsx
     import { StrictMode } from 'react'
     import { createRoot } from 'react-dom/client'
     import App from './App.jsx'
     import './styles/app.css'

     createRoot(document.getElementById('root')).render(
       <StrictMode>
         <App />
       </StrictMode>,
     )
     ```
     No Context Provider currently wraps `<App />`.
   - In `src/` directory:
     - No `src/context/` directory or `ThemeContext.jsx` file exists currently.
     - `src/components/Nav.jsx` (lines 40–78) has no theme toggle button.
3. **Master Project Plan Contract**:
   - In `PROJECT.md` (lines 118–125):
     ```ts
     interface ThemeContextType {
       theme: 'dark' | 'light';
       toggleTheme: () => void;
       setTheme: (theme: 'dark' | 'light') => void;
     }
     ```
   - In `PROJECT.md` (lines 43–54):
     - Dark Purple Theme (Default): obsidian `#0b0612`, elevated violet `#12091f` / `#1a0d2e`, radiant violet `#9d4edd` / `#a855f7`.
     - Light Theme (Accessible Option): violet-tinted paper `#faf8fd`, card surface `#ffffff`, dark text `#150d24`, violet accents `#7c3aed`.
     - State requirement: React Context synchronizing `document.documentElement` attributes (`data-theme="dark"` / `data-theme="light"` and class `.dark` / `.light`) with instant persistence in `localStorage`.
4. **Emil Kowalski Design Engineering Standards**:
   - In `emil-design-engineering/SKILL.md` (lines 11–28):
     - Hit target minimum `>= 44x44px`.
     - Tactile button compression: `:active { transform: scale(0.97); }`.
     - Snappy easing `cubic-bezier(0.16, 1, 0.3, 1)` and transition `<= 300ms`.

---

## 2. Logic Chain

From these observations, we derive the exact technical architecture:

1. **Eliminating Flash of Unstyled Content (FOUC)** (from Observation 1):
   - Because `main.jsx` is an asynchronous ES module, waiting for React to mount before setting the theme causes a visible flash: if a returning user prefers the light theme (`#faf8fd`), the page parses HTML and paints dark purple before flipping to light 100–300ms later.
   - An inline synchronous `<script>` placed in `<head>` before any stylesheet or body markup resolves this: it checks `localStorage.getItem('mg_theme')`, falls back to `window.matchMedia('(prefers-color-scheme: light)').matches`, and immediately applies `data-theme`, `classList.add(...)`, `style.colorScheme`, and updates `meta[name="theme-color"]`.
   - By the time the browser renders the first paint, the DOM is 100% styled in the user's active theme with **0ms visual delay**.

2. **React State & Hydration Alignment** (from Observation 1 & 2):
   - When `ThemeProvider` mounts in React, its initial state must read `document.documentElement.getAttribute('data-theme')` directly.
   - Because the zero-FOUC script already initialized that attribute, React's state matches the DOM immediately without re-rendering or triggering any mismatch.

3. **DOM Attribute Dual-Synchronization** (from Observation 3):
   - Modern Tailwind v4 and CSS variables benefit from both selectors:
     - `[data-theme="dark"]` and `[data-theme="light"]` for semantic CSS variable scopes.
     - `.dark` and `.light` classes for Tailwind v4 utility variants and external component compatibility.
   - Therefore, `ThemeProvider` must atomically toggle both `document.documentElement.setAttribute('data-theme', theme)` and `document.documentElement.classList.replace(...)`.

4. **Multi-Tab & System Preference Reactivity**:
   - If a user changes their OS theme while browsing and has not manually locked a theme preference in `localStorage`, the site should respond dynamically via a `matchMedia('change')` listener.
   - If a user changes the theme in Tab A, Tab B should update immediately via `window.addEventListener('storage', ...)`.

5. **Tactile, Accessible Toggle Button** (from Observation 4):
   - The toggle button must meet WCAG and Emil Kowalski standards:
     - Minimum 44x44px touch/click target (`min-w-[44px] min-h-[44px]`).
     - Snappy active compression (`:active { transform: scale(0.97); }`).
     - Distinct Sun and Moon SVG icons (no heavy external icon library).
     - Screen reader label `aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}`.

---

## 3. Caveats

1. **Storage Access in Sandboxed Environments**:
   In strict private browsing modes or sandboxed iframes, accessing `window.localStorage` can throw a `SecurityError`. Both the inline `<head>` script and `ThemeProvider.jsx` wrap storage access in `try...catch` blocks and gracefully default to the primary dark purple theme without failing.
2. **SSR / Client-Side Only**:
   The current project is a client-side SPA with Vite. All `window` and `document` calls are guarded with `typeof window !== 'undefined'` so that any future static pre-rendering (SSG) will not fail.

---

## 4. Conclusion & Concrete Code Recommendations for Worker

The worker agent can implement the complete theme architecture by creating and modifying the following files:

### File 1: Create `src/context/ThemeContext.jsx`

```jsx
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
    });
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
```

---

### File 2: Update `index.html` (Zero-FOUC Script)

Add the synchronous blocking script into `<head>` directly above the fonts and stylesheet links:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mary Grace V. Soronio, embedded systems, MSU-IIT</title>
    <meta
      name="description"
      content="Mary Grace V. Soronio is a fourth-year embedded systems student at MSU-IIT who builds the device and the dashboard: seventeen projects from gas sensors and AVR assembly to React and Laravel."
    />
    <meta name="theme-color" content="#0b0612" />
    
    <!-- 0ms Zero-FOUC Theme Script: executes synchronously before DOM paint -->
    <script>
      (function () {
        try {
          var k = 'mg_theme';
          var s = localStorage.getItem(k);
          var t;
          if (s === 'light' || s === 'dark') {
            t = s;
          } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            t = 'light';
          } else {
            t = 'dark';
          }
          var root = document.documentElement;
          root.setAttribute('data-theme', t);
          root.classList.remove('dark', 'light');
          root.classList.add(t);
          root.style.colorScheme = t;
          var m = document.querySelector('meta[name="theme-color"]');
          if (m) m.setAttribute('content', t === 'light' ? '#faf8fd' : '#0b0612');
        } catch (e) {
          document.documentElement.setAttribute('data-theme', 'dark');
          document.documentElement.classList.add('dark');
        }
      })();
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Onest:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    ...
```

---

### File 3: Create `src/components/ThemeToggle.jsx`

```jsx
import { useTheme } from '../context/ThemeContext.jsx'

/**
 * Tactile, accessible theme toggle button meeting Emil Kowalski standards:
 * - Minimum 44x44px hit area
 * - Active compression: :active { transform: scale(0.97); }
 * - Snappy rotation/opacity micro-interaction
 * - Zero external icon dependencies
 */
export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`relative inline-flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-pill border border-rule bg-paper-2/80 text-ink-2 shadow-xs backdrop-blur-md transition-all duration-150 hover:border-accent hover:text-ink active:scale-97 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${className}`}
    >
      <span className="sr-only">
        {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      </span>
      {isDark ? (
        // Sun icon: indicates light theme option
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 transition-transform duration-200 ease-out hover:rotate-45"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path
            strokeLinecap="round"
            d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m14.14-14.14l-1.41 1.41"
          />
        </svg>
      ) : (
        // Moon icon: indicates dark theme option
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 transition-transform duration-200 ease-out hover:-rotate-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  )
}
```

---

### File 4: Update `src/main.jsx`

Wrap `<App />` with `<ThemeProvider>`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import './styles/app.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
```

---

### File 5: Integrate into Navigation (`src/components/Nav.jsx`)

Add `ThemeToggle` next to the email button:

```jsx
import ThemeToggle from './ThemeToggle.jsx'
// ... inside Nav header cluster:
<div className="flex items-center justify-between gap-md md:justify-end md:gap-lg">
  <nav aria-label="Sections" className="flex items-center gap-xs md:gap-md">
    {/* links */}
  </nav>
  <div className="flex items-center gap-xs">
    <ThemeToggle />
    <a className="btn btn-primary" href={`mailto:${contact.email}`}>
      Email Me
    </a>
  </div>
</div>
```

---

## 5. Verification Method

1. **Zero-FOUC Verification**:
   - Set localStorage: `localStorage.setItem('mg_theme', 'light')`.
   - Perform a hard refresh in the browser (`Ctrl+F5` or `Shift+Reload`).
   - Observe the initial frame: verify that the page renders immediately in light paper (`#faf8fd`) with zero dark purple flicker.
2. **State & DOM Attributes Sync Verification**:
   - Open browser developer tools console and run:
     ```javascript
     document.documentElement.getAttribute('data-theme')
     document.documentElement.className
     ```
   - Click the `ThemeToggle` button.
   - Verify that:
     - `data-theme` switches between `"dark"` and `"light"`.
     - `document.documentElement.className` contains `"dark"` or `"light"`.
     - `localStorage.getItem('mg_theme')` matches the chosen theme.
     - `document.querySelector('meta[name="theme-color"]').getAttribute('content')` switches between `#0b0612` and `#faf8fd`.
3. **Cross-Tab Sync Verification**:
   - Open two tabs of the application side by side.
   - Toggle the theme in Tab A.
   - Verify Tab B instantly updates its theme without page reload.
4. **Hit Target & Accessibility Audit**:
   - Inspect the toggle button element: verify bounding client rect width and height are `>= 44px`.
   - Verify `aria-label` is present and updates dynamically.
5. **Production Build Verification**:
   ```powershell
   npm run build
   ```
   *Expected outcome*: Exits with code 0 and emits clean assets to `dist/`.
