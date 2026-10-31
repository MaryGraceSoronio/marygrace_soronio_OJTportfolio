import { contact } from '../data/site.js'

export default function Hero() {
  return (
    <section className="flex min-h-dvh flex-col justify-center pt-5xl lg:pt-4xl">
      <div className="shell grid items-center gap-2xl lg:grid-cols-12 lg:gap-col">
        <div className="settle lg:col-span-6">
          {/* Hardware status badge */}
          <div className="inline-flex items-center gap-xs rounded-pill border border-rule-2 bg-paper-2 px-md py-xs text-xs font-medium text-ink-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="tabular-nums font-mono">AVAILABLE FOR 700-HOUR OJT</span>
            <span className="text-muted">·</span>
            <span className="text-muted">ILIGAN CITY</span>
          </div>

          <h1 className="mt-md text-display text-ink">A Board That Plays Für Elise</h1>
          <p className="mt-lg max-w-[65ch] text-lead text-ink-2">
            Fourth-year embedded systems student at MSU-IIT. I build physical devices and digital telemetry dashboards.
          </p>
          <div className="mt-xl flex flex-wrap items-center gap-sm">
            <a className="btn btn-primary" href="#work">
              See the Work
            </a>
            <a
              className="btn btn-outline"
              href={contact.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
            <a
              className="btn btn-outline"
              href={`mailto:${contact.email}`}
            >
              Inquire for OJT
            </a>
          </div>
        </div>

        <figure className="settle-2 lg:col-span-6 lg:col-start-7 lg:pl-2xl">
          <div className="hero-board-frame group cursor-crosshair">
            <img
              src="/work/hero-board.jpg"
              width="1200"
              height="1500"
              fetchPriority="high"
              alt="The STM32F407 board I built the MP3 player on, its OLED still lit, with the ES8388 codec and the audio jacks in frame."
              className="hero-board w-full object-cover"
            />
          </div>
          <figcaption className="mt-sm max-w-[65ch] text-sm text-ink-2">
            <span className="font-mono text-xs text-accent-light">BOARD TELEMETRY:</span> The MP3 player with STM32F407, ES8388 codec, FreeRTOS audio streams, and OLED track list.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}