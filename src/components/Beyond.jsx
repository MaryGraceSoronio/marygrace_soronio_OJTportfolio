import { roles } from '../data/site.js'

export default function Beyond() {
  return (
    <section className="bg-paper-2 py-3xl">
      <div className="shell">
        <h2 className="text-section text-ink">Council, Classroom, Camera</h2>

        <ol className="mt-2xl border-t border-rule">
          {roles.map((item) => (
            <li
              key={item.role}
              className="grid gap-2xs border-b border-rule py-xl md:grid-cols-12 md:items-baseline md:gap-col"
            >
              <h3 className="text-lead text-ink md:col-span-6">{item.role}</h3>
              <p className="text-sm text-muted md:col-span-3 md:col-start-8">{item.org}</p>
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
