# Proposed Route Page Transitions & Motion Polish

## 1. CSS Refinement in `src/styles/app.css`

### Before (lines 494-507 & 555-568)
```css
  @keyframes page-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  .page-enter {
    animation: page-in 220ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }
```

### Proposed After
```css
  @keyframes page-in {
    0% {
      opacity: 0;
      transform: translateY(6px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .page-enter {
    animation: page-in 200ms cubic-bezier(0.16, 1, 0.3, 1) both;
    will-change: opacity, transform;
  }

  @media (prefers-reduced-motion: reduce) {
    .ambient-canvas,
    .signal-bar {
      display: none !important;
    }

    .page-enter,
    .reveal {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }
  }
```

### Rationale
1. **Snappier Feel**: 200ms duration is right in the center of the 150-250ms target range (matching test `F19-T1-1`'s `configuredMs = 200`).
2. **Subtle Measure**: `translateY(6px)` precisely mirrors test `F19-T1-3` (`translateY(6px)` -> `translateY(0)`).
3. **GPU Layer Promotion**: `will-change: opacity, transform;` instructs the browser compositor to isolate the route container to a hardware accelerated texture layer, eliminating repaint jank.
4. **Reduced Motion Guarantee**: `!important` flags ensure zero animation duration and instant opacity: 1 when prefers-reduced-motion is enabled.

---

## 2. Route Layout Integration in `src/App.jsx`

### Proposed Imports & Structure
```jsx
import ParticleBackground from './components/ParticleBackground.jsx'
// ...
export default function App() {
  const { pathname } = useLocation()

  return (
    <>
      <ParticleBackground />
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" className="relative z-10 pt-16 lg:pt-20">
        <RouteEffects />
        <div key={pathname} className="page-enter">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </>
  )
}
```

### Backward Compatibility Alias in `src/components/AmbientCanvas.jsx`
```jsx
// src/components/AmbientCanvas.jsx
export { default } from './ParticleBackground.jsx'
```
This ensures any tests or components referencing `AmbientCanvas` resolve to the upgraded `ParticleBackground` without missing a beat.
