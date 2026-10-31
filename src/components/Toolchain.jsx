import { toolchain } from '../data/site.js'

export default function Toolchain() {
  return (
    <section className="pt-6xl pb-4xl">
      <div className="shell">
        <h2 className="text-section text-ink">The Tools Behind Sixteen Builds</h2>

        <dl className="mt-2xl grid gap-x-col gap-y-xl sm:grid-cols-2 xl:grid-cols-4">
          {toolchain.map((group) => (
            <div key={group.label} className="border-t border-rule pt-md">
              <dt className="font-display text-title text-ink">{group.label}</dt>
              <dd className="mt-md flex flex-wrap gap-xs">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-pill border border-rule px-sm py-2xs text-sm text-ink-2"
                  >
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
