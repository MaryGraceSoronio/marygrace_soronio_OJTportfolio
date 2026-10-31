import { Link } from 'react-router-dom'
import ImageWithSkeleton from './ImageWithSkeleton.jsx'

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="font-mono text-sm text-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-accent-light"
    >
      &rarr;
    </span>
  )
}

export default function ProjectCard({
  project,
  index,
  featured = false,
  eager = false,
}) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className={`group pressable relative flex flex-col overflow-hidden rounded-card border border-rule bg-paper-2 shadow-card transition-all duration-200 hover:border-accent hover:shadow-elevated active:scale-[0.98] ${
        featured ? '' : 'h-full'
      }`}
    >
      <div
        className={`relative overflow-hidden border-b border-rule bg-paper-3 ${
          featured ? 'aspect-[16/10]' : 'aspect-[16/10]'
        }`}
      >
        <ImageWithSkeleton
          src={project.image}
          alt={`${project.title}: ${project.subtitle}`}
          width={project.w}
          height={project.h}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fallbackText={project.title}
          aspectRatio="aspect-[16/10]"
          containerClassName="h-full w-full"
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />

        {/* Index Pill */}
        <span className="absolute left-md top-md z-20 rounded-pill border border-rule-2 bg-paper/85 px-sm py-3xs font-mono text-xs tabular-nums text-ink-2 backdrop-blur-sm">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className={`flex flex-1 flex-col gap-xs p-lg ${featured ? 'lg:p-xl' : ''}`}>
        <div className="flex items-center justify-between gap-xs">
          <p className="font-mono text-xs text-accent-light uppercase tracking-wider">
            {project.categoryLabel}
          </p>
          <span className="font-mono text-xs tabular-nums text-muted">{project.period}</span>
        </div>
        <h3
          className={`font-display font-semibold tracking-tight text-ink transition-colors duration-150 group-hover:text-accent-light ${
            featured ? 'text-title lg:text-section' : 'text-title'
          }`}
        >
          {project.title}
        </h3>
        <p className={`text-sm text-ink-2 ${featured ? 'max-w-prose' : ''}`}>{project.line}</p>
        <div className="mt-auto flex items-end justify-between gap-sm pt-md border-t border-rule/50">
          <p className="font-mono text-xs text-muted line-clamp-1">{project.stack}</p>
          <Arrow />
        </div>
      </div>
    </Link>
  )
}
