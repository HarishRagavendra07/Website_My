import type { Site } from "@/lib/content";
import { ChevronIcon, DownloadIcon, ExternalIcon, SparkleIcon } from "./icons";
import { Chip, Section, btnOutline, btnPrimary } from "./ui";

export default function Research({ site }: { site: Site }) {
  if (site.research.length === 0) return null;

  return (
    <Section id="research" label="Research" title="Research">
      <div className="space-y-5">
        {site.research.map((paper) => (
          <article
            key={paper.title}
            className="relative overflow-hidden rounded-card border border-border bg-card p-5 sm:p-7"
          >
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-gradient-to-br from-electric-blue/20 via-violet/15 to-cyan/20 blur-3xl"
            />
            <div className="relative">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-bg text-ink">
                  <SparkleIcon className="w-3 h-3 text-electric-blue" />
                  {paper.kind}
                </span>
                <span>{paper.venue}</span>
                <span aria-hidden="true">·</span>
                <span>{paper.year}</span>
              </p>
              <h3 className="font-heading font-medium text-[22px] sm:text-[26px] leading-tight tracking-[-0.02em] text-ink mb-2 max-w-3xl">
                {paper.title}
              </h3>
              <p className="text-sm text-muted mb-4">{paper.authors.join(", ")}</p>
              <p className="text-ink leading-relaxed max-w-3xl mb-6">{paper.summary}</p>

              {paper.metrics.length > 0 && (
                <dl className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {paper.metrics.map((m) => (
                    <div key={m.label} className="flex flex-col-reverse rounded-card border border-border bg-bg p-3">
                      <dt className="text-xs text-muted mt-0.5">{m.label}</dt>
                      <dd className="ai-gradient text-[24px] font-medium tracking-[-0.02em] w-fit">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <details className="group mb-6 max-w-3xl">
                <summary className="flex items-center gap-1.5 w-fit cursor-pointer list-none text-sm font-medium text-ink hover:text-electric-blue transition-colors [&::-webkit-details-marker]:hidden">
                  <ChevronIcon className="w-4 h-4 transition-transform group-open:rotate-180" />
                  <span className="group-open:hidden">Read abstract</span>
                  <span className="hidden group-open:inline">Hide abstract</span>
                </summary>
                <p className="mt-3 text-sm text-muted leading-relaxed">{paper.abstract}</p>
              </details>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {paper.tags.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a href={paper.pdf} target="_blank" rel="noopener noreferrer" className={`${btnPrimary} flex items-center gap-2`}>
                  <ExternalIcon className="w-4 h-4" /> Read paper
                </a>
                <a href={paper.pdf} download className={btnOutline}>
                  <DownloadIcon /> Download PDF
                </a>
                {paper.pdfInfo && <span className="text-xs text-muted">{paper.pdfInfo}</span>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
