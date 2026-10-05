import type { Project, Site } from "@/lib/content";
import { socialLinks } from "./Hero";
import ProjectCard from "./ProjectCard";
import { CheckIcon, DownloadIcon } from "./icons";
import { Chip, Section, btnOutline, btnPrimary } from "./ui";

const card = "max-w-2xl bg-card border border-border rounded-card p-5 shadow-[0_1px_2px_0_rgb(0_0_0/0.05)]";

export function About({ site }: { site: Site }) {
  return (
    <Section id="about" label="About" title="About">
      <div className="max-w-2xl bg-card border border-border rounded-card p-5 space-y-4">
        {site.about.map((p, i) => (
          <p key={i} className="text-ink leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    </Section>
  );
}

export function Projects({ site, projects }: { site: Site; projects: Project[] }) {
  return (
    <Section id="projects" label="Featured projects" title="Selected Work" intro={site.projectsIntro}>
      {projects.length === 0 ? (
        <div className="max-w-3xl rounded-card border border-dashed border-ink/20 p-8 text-center">
          <p className="text-sm text-muted">Projects coming soon.</p>
          {process.env.NODE_ENV !== "production" && (
            <p className="text-sm text-muted mt-2">
              Add your first one at{" "}
              <a href="/admin" className="text-electric-blue underline">
                /admin
              </a>
              .
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-5 max-w-3xl">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      )}
    </Section>
  );
}

export function Skills({ site }: { site: Site }) {
  return (
    <Section id="skills" label="Technical skills" title="Technical Skills" intro={site.skillsIntro}>
      <div className="grid gap-4 sm:grid-cols-2">
        {site.skills.map((g) => (
          <div key={g.group} className="rounded-card border border-border bg-card p-4">
            <h3 className="text-xs uppercase tracking-[0.08em] font-medium mb-3 text-muted">{g.group}</h3>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Experience({ site }: { site: Site }) {
  return (
    <Section id="experience" label="Work experience" title="Experience">
      <div className="space-y-5">
        {site.experience.map((job) => (
          <div key={job.title + job.company} className={card}>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
              <h3 className="font-medium text-ink">{job.title}</h3>
              <span className="text-xs text-muted shrink-0">{job.dates}</span>
            </div>
            <p className="text-sm text-muted mb-4">
              {job.company}
              {job.note && ` · ${job.note}`}
            </p>
            <ul className="space-y-1.5 mb-5">
              {job.points.map((pt, i) => (
                <li key={i} className="text-sm text-muted flex gap-2">
                  <span className="text-ink">
                    <CheckIcon className="w-3.5 h-3.5 mt-[3px] shrink-0" />
                  </span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((t) => (
                <Chip key={t} mono={false}>
                  {t}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Education({ site }: { site: Site }) {
  return (
    <Section id="education" label="Education" title="Education">
      <div className="space-y-5">
        {site.education.map((ed) => (
          <div key={ed.degree} className={card}>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
              <h3 className="font-medium text-ink">{ed.degree}</h3>
              <span className="text-xs text-muted shrink-0">{ed.dates}</span>
            </div>
            <p className="text-sm text-muted">{ed.school}</p>
            {ed.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {ed.badges.map((b) => (
                  <span key={b} className="text-xs px-2.5 py-1 rounded-full bg-card-alt text-ink">
                    {b}
                  </span>
                ))}
              </div>
            )}
            {ed.coursework.length > 0 && (
              <>
                <h4 className="text-[11px] text-muted uppercase tracking-wider mt-5 mb-2">Coursework</h4>
                <div className="flex flex-wrap gap-2">
                  {ed.coursework.map((c) => (
                    <span key={c} className="text-[11px] px-2.5 py-1 rounded-full border border-border text-muted">
                      {c}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Contact({ site }: { site: Site }) {
  const socials = socialLinks(site).filter((s) => s.label !== "Email");
  return (
    <Section id="contact" as="footer" label="Contact and footer" title="Get in Touch" intro={site.contact.intro}>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="bg-card border border-border rounded-card p-5">
          <h3 className="font-medium text-ink mb-1">{site.contact.cardTitle}</h3>
          <p className="text-sm text-muted mb-5">{site.contact.cardText}</p>
          <ul className="space-y-2 mb-6">
            {site.contact.lookingFor.map((item) => (
              <li key={item} className="text-sm text-ink flex gap-2">
                <span className="text-muted" aria-hidden="true">
                  •
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <a href={`mailto:${site.email}`} className={btnPrimary}>
              Email me
            </a>
            {socials.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={btnOutline}>
                <Icon /> {label}
              </a>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-card p-5">
          <h3 className="font-medium text-ink mb-1">Download Resume</h3>
          <p className="text-sm text-muted mb-5">{site.resume.label} resume (PDF).</p>
          <a href={site.resume.file} download className={`${btnOutline} !text-sm w-fit`}>
            <DownloadIcon />
            {site.resume.label}
          </a>
        </div>
      </div>
      <div className="border-t border-border pt-6 mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className="text-xs text-muted">Built with Next.js + Tailwind CSS · Deployed on Vercel</p>
      </div>
    </Section>
  );
}
