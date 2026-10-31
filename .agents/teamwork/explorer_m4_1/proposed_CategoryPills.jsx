import { useMemo } from 'react'
import { categories, projects } from '../data/projects.js'

/**
 * CategoryPills - Reusable Category Filter Pills Component
 *
 * Emil Kowalski Standards:
 * - Minimum 44x44px touch target bounding box (min-h-[44px])
 * - Active tactile compression (active:scale-[0.97])
 * - Tabular numerals on item count badges (tabular-nums font-mono)
 * - Accessible grouping (role="group", aria-label, aria-pressed)
 */
export default function CategoryPills({
  activeCategory = 'all',
  onSelectCategory,
  className = '',
}) {
  // Precompute category item counts from authentic projects catalog
  const categoryCounts = useMemo(() => {
    const counts = { all: projects.length }
    for (const cat of categories) {
      if (cat.id !== 'all') {
        counts[cat.id] = projects.filter((p) => p.category === cat.id).length
      }
    }
    return counts
  }, [])

  return (
    <div
      className={`flex flex-wrap items-center gap-xs ${className}`}
      role="group"
      aria-label="Filter builds by category"
    >
      {categories.map((category) => {
        const isActive = activeCategory === category.id
        const count = categoryCounts[category.id] ?? 0

        return (
          <button
            key={category.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelectCategory?.(category.id)}
            className={`pressable inline-flex min-h-[44px] items-center gap-xs rounded-pill border px-md py-xs text-xs font-medium tracking-wide transition-all duration-150 cursor-pointer ${
              isActive
                ? 'border-accent bg-accent text-accent-ink shadow-sm'
                : 'border-rule-2 bg-paper-2 text-ink-2 hover:border-accent hover:text-ink hover:bg-paper-3'
            }`}
          >
            <span>{category.label}</span>
            <span
              className={`inline-flex items-center justify-center rounded-pill px-2xs py-3xs font-mono text-[11px] tabular-nums transition-colors ${
                isActive
                  ? 'bg-paper/20 text-accent-ink font-semibold'
                  : 'bg-paper-3 text-muted'
              }`}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
