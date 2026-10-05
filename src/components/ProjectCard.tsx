"use client";

import { useState } from "react";
import type { Project } from "@/lib/content";
import { CheckIcon, ChevronIcon, ExternalIcon, GitHubIcon } from "./icons";
import { Chip } from "./ui";

const iconBtn =
  "flex items-center justify-center w-7 h-7 rounded-full border border-border text-muted hover:border-electric-blue hover:text-electric-blue transition-colors";

export function ProjectMedia({ src, alt }: { src: string; alt: string }) {
  if (!src) return null;
  const video = /\.(mp4|webm|mov)$/i.test(src);
  return (
    <div className="aspect-[2/1] w-full overflow-hidden border-b border-border bg-card-alt">
      {video ? (
        <video
          src={src}
          aria-label={alt}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover object-top"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- GIFs must not go through image optimisation
        <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover object-top" />
      )}
    </div>
  );
}

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [open, setOpen] = useState(false);
  const hasDetails = project.details.some((d) => d.heading || d.points.length);

  return (
    <article className="rounded-card border border-border bg-card overflow-hidden shadow-[0_1px_2px_0_rgb(0_0_0/0.05)] hover:border-ink/20 transition-colors duration-200">
      <ProjectMedia src={project.media} alt={project.mediaAlt || project.title} />
      <div className="p-3">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <span className="font-mono text-xs text-muted tabular-nums">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="font-medium text-[15px] leading-snug text-ink">{project.title}</h3>
            {project.tag && (
              <span className="text-[11px] px-2 py-0.5 rounded-full border border-ink text-ink">{project.tag}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="View source on GitHub" className={iconBtn}>
                <GitHubIcon className="w-3.5 h-3.5" />
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" aria-label="View live demo" className={iconBtn}>
                <ExternalIcon />
              </a>
            )}
          </div>
        </div>

        {project.summary && <p className="text-sm leading-relaxed mb-3 text-ink">{project.summary}</p>}

        {project.highlights.length > 0 && (
          <ul className="space-y-1.5 mb-3">
            {project.highlights.map((h, i) => (
              <li key={i} className="text-sm text-muted flex gap-2">
                <CheckIcon className="w-3.5 h-3.5 mt-[3px] shrink-0 text-ink" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        {project.demoLogin && project.demoLogin.fields.length > 0 && (
          <div className="rounded-card border border-border bg-card-alt p-3 mb-3">
            <p className="text-[11px] uppercase tracking-[0.08em] font-medium mb-2 text-muted">
              {project.demoLogin.label || "Try it yourself"}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink">
              {project.demoLogin.fields.map((f) => (
                <span key={f.name}>
                  <span className="text-muted">{f.name}:</span> <span className="font-mono">{f.value}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {project.tech.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tech.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        )}

        {hasDetails && (
          <>
            <button
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="text-sm font-medium transition-colors flex items-center gap-1.5 text-ink hover:text-electric-blue"
            >
              <ChevronIcon className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} />
              {open ? "Show less" : "Read more"}
            </button>
            {open && (
              <div className="mt-4 pt-4 border-t border-border space-y-4">
                {project.details.map((d, i) => (
                  <div key={i}>
                    {d.heading && (
                      <h4 className="text-[11px] uppercase tracking-[0.08em] font-medium mb-2 text-muted">{d.heading}</h4>
                    )}
                    <ul className="space-y-1.5">
                      {d.points.map((p, j) => (
                        <li key={j} className="text-sm text-ink leading-relaxed flex gap-2">
                          <span className="text-muted" aria-hidden="true">
                            •
                          </span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </article>
  );
}
