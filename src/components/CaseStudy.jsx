const specs = [
  {
    label: 'sensing array',
    channel: 'CH01 - CH04',
    value: 'MQ-137 (Ammonia), MQ-136 (H₂S), MQ-135 (Air Quality), NDIR optical CO₂ channel',
  },
  {
    label: 'signal chain',
    channel: '16-BIT ADC',
    value: 'Precision ADS1115 analog-to-digital converter over isolated I²C bus',
  },
  {
    label: 'compute stack',
    channel: 'EDGE SBC',
    value: 'Raspberry Pi 4B: deterministic local sampling, on-device SQLite buffer, Firebase cloud telemetry',
  },
  {
    label: 'inference model',
    channel: 'ML PIPELINE',
    value: '10-minute gas evolution windows mapped into a 22-feature statistical vector',
  },
  {
    label: 'classification',
    channel: 'REAL-TIME VERDICT',
    value: 'Instant safety classification: Fresh / Active Fermentation / Spoilage Alert',
  },
]

export default function CaseStudy() {
  return (
    <section id="about" className="bg-paper-2 py-4xl">
      <div className="shell">
        <div className="grid gap-md lg:grid-cols-12 lg:items-end lg:gap-col">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-xs rounded-pill border border-rule-2 bg-paper px-md py-2xs text-xs font-mono text-accent-light">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>THESIS SPECIFICATION · FERMONITOR</span>
            </div>
            <h2 className="mt-xs text-section text-ink">The Nose That Reads Bagoong</h2>
          </div>
          <p className="max-w-[65ch] text-lead text-ink-2 lg:col-span-5">
            My undergraduate thesis. I designed the gas sampling chamber, wrote the deterministic signal acquisition loop, and built the live verification console below.
          </p>
        </div>

        <figure className="mt-2xl">
          <picture>
            <source media="(max-width: 767px)" srcSet="/work/case-fermonitor-verdict.jpg" />
            <img
              src="/work/case-fermonitor.jpg"
              width="1600"
              height="900"
              loading="lazy"
              alt="FERMONITOR’s Food Safety Status panel reading SAFE TO EAT, with the model’s pH, temperature and gas readings all stable."
              className="aspect-3/2 w-full rounded-card border border-rule object-cover md:aspect-auto"
            />
          </picture>
          <figcaption className="mt-sm flex flex-wrap items-center justify-between gap-sm text-sm text-muted">
            <span>Live electronic nose telemetry dashboard displaying batch classification</span>
            <span className="font-mono text-xs text-accent-light">STATUS: SAFE TO EAT</span>
          </figcaption>
        </figure>

        <dl className="mt-2xl border-t border-rule">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="grid gap-2xs border-b border-rule py-lg md:grid-cols-12 md:items-baseline md:gap-col"
            >
              <dt className="flex items-center gap-xs font-mono text-xs tracking-wider uppercase text-muted md:col-span-3">
                <span>{spec.label}</span>
              </dt>
              <dd className="tabular-nums text-md text-ink-2 md:col-span-7">
                {spec.value}
              </dd>
              <div className="font-mono text-xs text-accent-light md:col-span-2 md:text-right">
                {spec.channel}
              </div>
            </div>
          ))}
        </dl>

        <div className="mt-xl flex flex-wrap items-baseline justify-between gap-md border-t border-rule-2 pt-md">
          <p className="text-md text-ink">
            BS Computer Applications, major in Embedded Systems, MSU-IIT
          </p>
          <p className="tabular-nums font-mono text-sm text-muted">
            CGPA: 1.67351 · DEAN’S LISTER
          </p>
        </div>
      </div>
    </section>
  )
}