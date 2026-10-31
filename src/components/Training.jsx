import { trainings } from '../data/site.js'

export default function Training() {
  return (
    <section id="training" className="pt-6xl pb-4xl">
      <div className="shell">
        <h2 className="text-section text-ink">Seminars, Certifications & Technical Workshops</h2>

        <ol className="mt-2xl border-t border-rule">
          {trainings.map((item) => (
            <li
              key={item.name}
              className="grid gap-2xs border-b border-rule py-2xl md:grid-cols-12 md:items-baseline md:gap-col"
            >
              <h3 className="text-lead text-ink md:col-span-6">{item.name}</h3>
              <p className="text-sm text-muted md:col-span-3 md:col-start-8">{item.issuer}</p>
              <p className="text-sm text-ink-2 md:col-span-2 md:col-start-11 md:text-right">
                {item.date}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
