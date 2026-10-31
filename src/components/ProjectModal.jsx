import { useEffect } from 'react'

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!project) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-md sm:p-xl"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-paper/80 backdrop-blur-md transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface - Emil Kowalski entrance: scale(0.96) -> scale(1) */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-y-auto rounded-card border border-rule-2 bg-paper-2 shadow-2xl transition-all duration-200 ease-out [transform-origin:center_center]">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-rule px-lg py-md">
          <div className="flex items-center gap-sm">
            <span className="font-display text-xs tracking-wider uppercase text-accent-light">
              Project Inspection
            </span>
            <span className="text-rule-2">/</span>
            <span className="text-xs uppercase tracking-wider text-muted">{project.category || 'Hardware'}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-pill text-ink-2 hover:bg-paper-3 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent-light"
            aria-label="Close dialog"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Media */}
        {project.image ? (
          <div className="border-b border-rule bg-paper">
            <img
              src={project.image}
              alt={project.name}
              className="max-h-[380px] w-full object-contain p-md"
            />
          </div>
        ) : null}

        {/* Content */}
        <div className="p-xl">
          <h2 id="modal-project-title" className="text-display-s text-ink">
            {project.name}
          </h2>
          <p className="mt-xs text-sm font-medium tracking-wide uppercase text-accent-light">
            {project.stack}
          </p>

          <p className="mt-md text-lead text-ink-2">
            {project.line}
          </p>

          {project.details && (
            <div className="mt-lg border-t border-rule pt-md">
              <h4 className="text-xs font-semibold tracking-wider uppercase text-muted">
                Architecture & Engineering Notes
              </h4>
              <p className="mt-xs text-md text-ink-2">
                {project.details}
              </p>
            </div>
          )}

          {/* Links & artifacts */}
          <div className="mt-xl flex flex-wrap items-center gap-md border-t border-rule pt-lg">
            {project.links && project.links.length > 0 ? (
              project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                >
                  <span>{link.label}</span>
                  <span className="ml-xs text-xs opacity-60">↗</span>
                </a>
              ))
            ) : (
              <span className="text-sm text-muted">
                {project.note || 'Internal coursework & thesis artifacts'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}