import { contact } from '../data/site.js'

export default function ContactBand() {
  return (
    <section id="contact" className="bg-band pt-5xl pb-4xl">
      <div className="shell grid gap-2xl lg:grid-cols-12 lg:items-end lg:gap-col">
        <div className="lg:col-span-7">
          <h2 className="text-display-s text-accent-ink">Seven Hundred Hours</h2>
          <p className="mt-md max-w-prose text-lead text-accent-ink">
            That is the OJT I am looking for. I want to build and ship physical hardware systems and connected dashboards on an engineering team.
          </p>
        </div>

        <div className="flex flex-col items-start gap-sm lg:col-span-5">
          <a className="btn btn-primary" href={`mailto:${contact.email}`}>
            Email Me
          </a>
          <a
            className="text-md text-accent-ink underline decoration-accent-ink/40 underline-offset-4 transition-colors duration-150 hover:decoration-accent-ink"
            href={`mailto:${contact.email}`}
          >
            {contact.email}
          </a>
          <a
            className="text-md text-accent-ink underline decoration-accent-ink/40 underline-offset-4 transition-colors duration-150 hover:decoration-accent-ink"
            href={contact.phoneHref}
          >
            {contact.phone}
          </a>
          <p className="mt-xs text-sm text-accent-ink">{contact.place}</p>
        </div>
      </div>
    </section>
  )
}
