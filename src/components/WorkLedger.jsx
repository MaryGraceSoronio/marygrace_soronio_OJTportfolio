import { useState } from 'react'
import { projects, categories } from '../data/projects.js'
import ProjectModal from './ProjectModal.jsx'

function Pane({ project, onInspect }) {
  return (
    <div className="sticky top-24">
      {project.image ? (
        <div className="group relative overflow-hidden rounded-card border border-rule bg-paper-2">
          <img
            key={project.slug}
            src={project.image}
            width={project.w}
            height={project.h}
            loading="lazy"
            alt={`${project.name}: ${project.line}`}
            className="aspect-16/10 w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
          />
          <button
            type="button"
            onClick={() => onInspect(project)}
            className="absolute right-3 bottom-3 flex h-11 items-center gap-xs rounded-pill border border-rule-2 bg-paper/90 px-md py-xs text-xs font-medium text-ink backdrop-blur-md transition-colors hover:border-accent hover:text-accent-light"
          >
            <span>Inspect Details</span>
            <span>↗</span>
          </button>
        </div>
      ) : null}

      <div
        className={
          project.image
            ? 'mt-md rounded-card border border-rule bg-paper-2 p-lg'
            : 'rounded-card border border-rule bg-paper-2 p-lg'
        }
      >
        <div className="flex items-baseline justify-between gap-md">
          <h3 className="text-title text-ink">{project.name}</h3>
          <button
            type="button"
            onClick={() => onInspect(project)}
            className="text-xs font-medium text-accent-light underline decoration-rule-2 underline-offset-4 hover:decoration-accent-light"
          >
            Open Spec Sheet
          </button>
        </div>
        <p className="mt-xs text-sm text-muted">{project.stack}</p>
        <p className="mt-sm text-md text-ink-2">{project.line}</p>

        {project.links.length > 0 ? (
          <ul className="mt-md flex flex-wrap items-center gap-lg">
            {project.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[44px] items-center text-sm text-ink-2 underline decoration-rule-2 underline-offset-4 transition-colors duration-150 hover:text-accent-light"
                >
                  {link.label} ↗
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-md text-sm text-muted">
            {project.note ?? 'coursework, so there is nothing public to open'}
          </p>
        )}
      </div>
    </div>
  )
}

export default function WorkLedger() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [active, setActive] = useState(projects[0].slug)
  const [inspectingProject, setInspectingProject] = useState(null)

  const filteredProjects = projects.filter(
    (p) => activeCategory === 'all' || p.category === activeCategory
  )

  const current =
    filteredProjects.find((p) => p.slug === active) ??
    filteredProjects[0] ??
    projects[0]

  return (
    <section id="work" className="pt-5xl pb-3xl">
      <div className="shell">
        <div className="flex flex-col justify-between gap-lg md:flex-row md:items-end">
          <div>
            <h2 className="text-section text-ink">Silicon to Screen</h2>
            <p className="mt-xs text-lead text-ink-2">
              Sixteen builds and a thesis still running.
            </p>
          </div>

          {/* Filter Pills with 44px hit-target */}
          <div className="flex flex-wrap items-center gap-xs">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id)
                    const firstMatch = projects.find(
                      (p) => cat.id === 'all' || p.category === cat.id
                    )
                    if (firstMatch) setActive(firstMatch.slug)
                  }}
                  className={`pressable inline-flex min-h-[44px] items-center rounded-pill px-md text-xs font-medium tracking-wide transition-colors duration-150 ${
                    isSelected
                      ? 'border border-accent bg-accent/20 text-accent-ink'
                      : 'border border-rule bg-paper-2 text-ink-2 hover:border-rule-2 hover:text-ink'
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-2xl grid gap-2xl lg:grid-cols-12 lg:gap-col">
          <ol className="border-t border-rule lg:col-span-7">
            {filteredProjects.map((project, index) => {
              const isActive = project.slug === current?.slug
              const indexFormatted = String(index + 1).padStart(2, '0')

              return (
                <li key={project.slug} className="border-b border-rule">
                  <div
                    tabIndex={0}
                    role="button"
                    aria-controls="work-preview"
                    aria-current={isActive ? 'true' : undefined}
                    onMouseEnter={() => setActive(project.slug)}
                    onFocus={() => setActive(project.slug)}
                    onClick={() => setActive(project.slug)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setActive(project.slug)
                      }
                    }}
                    className={`group flex min-h-[56px] w-full cursor-pointer items-baseline justify-between py-md text-left transition-colors duration-150 ${
                      isActive ? 'text-accent-light' : 'text-ink-2 hover:text-ink'
                    }`}
                  >
                    <div className="flex items-baseline gap-md">
                      <span className="tabular-nums font-mono text-xs text-muted">
                        {indexFormatted}
                      </span>
                      <span className="font-display text-title tracking-tight">
                        {project.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-md">
                      <span className="hidden text-sm text-muted sm:inline">
                        {project.stack}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setInspectingProject(project)
                        }}
                        className="pressable inline-flex h-8 w-8 items-center justify-center rounded-pill border border-rule text-xs text-ink-2 hover:border-accent hover:text-accent-light"
                        aria-label={`Inspect ${project.name}`}
                      >
                        ↗
                      </button>
                    </div>
                  </div>

                  {/* Inline pane display on smaller screens */}
                  {isActive && (
                    <div className="pb-lg lg:hidden">
                      <Pane project={project} onInspect={setInspectingProject} />
                    </div>
                  )}
                </li>
              )
            })}
          </ol>

          {/* Persistent sticky desktop inspection pane */}
          <aside
            id="work-preview"
            aria-live="polite"
            className="hidden lg:col-span-5 lg:col-start-8 lg:block"
          >
            {current && <Pane project={current} onInspect={setInspectingProject} />}
          </aside>
        </div>
      </div>

      {inspectingProject && (
        <ProjectModal
          project={inspectingProject}
          onClose={() => setInspectingProject(null)}
        />
      )}
    </section>
  )
}