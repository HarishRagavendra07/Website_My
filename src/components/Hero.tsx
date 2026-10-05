import type { Site } from "@/lib/content";
import { ArrowRightIcon, ChevronIcon, GitHubIcon, LinkedInIcon, MailIcon } from "./icons";
import { btnOutline, btnPrimary } from "./ui";

// Class names are spelled out in full so Tailwind can find them.
const delays: Record<string, string> = {
  "0s": "",
  "0.1s": "[animation-delay:0.1s]",
  "0.2s": "[animation-delay:0.2s]",
  "0.3s": "[animation-delay:0.3s]",
  "0.35s": "[animation-delay:0.35s]",
  "0.4s": "[animation-delay:0.4s]",
  "0.5s": "[animation-delay:0.5s]",
  "0.6s": "[animation-delay:0.6s]",
  "0.7s": "[animation-delay:0.7s]",
};
const fade = (delay: string) => `opacity-0 animate-fade-up ${delays[delay]}`;

export function socialLinks(site: Site) {
  return [
    site.linkedin && { href: site.linkedin, label: "LinkedIn", Icon: LinkedInIcon, external: true },
    site.github && { href: site.github, label: "GitHub", Icon: GitHubIcon, external: true },
    site.email && { href: `mailto:${site.email}`, label: "Email", Icon: MailIcon, external: false },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof MailIcon; external: boolean }[];
}

export default function Hero({ site }: { site: Site }) {
  const socials = socialLinks(site);

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="min-h-screen flex flex-col justify-center px-4 pt-24 pb-16 max-w-[1200px] mx-auto"
    >
      <div className="grid lg:grid-cols-[1fr_auto] gap-14 items-center">
        <div className="max-w-2xl">
          <div className={`flex flex-wrap gap-2 mb-6 ${fade("0s")}`}>
            <span className="text-xs px-3 py-1 rounded-full border border-ink text-ink">{site.role}</span>
            <span className="text-xs px-3 py-1 rounded-full border border-ink text-ink">{site.location}</span>
          </div>
          <p className={`text-[11px] tracking-[0.15em] text-muted uppercase mb-3 ${fade("0.1s")}`}>
            Hello, I&apos;m
          </p>
          <h1
            className={`font-heading font-medium text-[44px] sm:text-[58px] lg:text-[70px] text-ink leading-[1] tracking-[-0.04em] mb-4 ${fade("0.2s")}`}
          >
            {site.name}.
          </h1>
          <p className={`font-medium text-lg sm:text-xl text-ink mb-4 leading-snug ${fade("0.3s")}`}>
            {site.headline} <span className="text-electric-blue">{site.headlineHighlight}</span>
          </p>
          <p className={`text-base text-muted mb-8 leading-relaxed max-w-xl ${fade("0.4s")}`}>{site.intro}</p>
          <div className={`flex flex-wrap gap-3 mb-6 ${fade("0.5s")}`}>
            <a href={site.resume.file} download className={btnPrimary}>
              Download Resume
            </a>
            <a href="#projects" className={btnOutline}>
              Explore Projects
            </a>
          </div>
          <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${fade("0.6s")}`}>
            {socials.map(({ href, label, Icon, external }, i) => (
              <span key={label} className="flex items-center gap-4">
                {i > 0 && (
                  <span className="text-border" aria-hidden="true">
                    ·
                  </span>
                )}
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors"
                >
                  <Icon /> {label}
                </a>
              </span>
            ))}
          </div>
        </div>

        <div className={`hidden lg:block ${fade("0.35s")}`} aria-hidden="true">
          <div className="w-72 rounded-card bg-graphite p-5 text-mist">
            <div className="flex items-center gap-2 mb-6">
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-blue opacity-50" />
                <span className="relative inline-flex rounded-full w-2 h-2 bg-electric-blue" />
              </span>
              <span className="text-xs text-mist/70">{site.availability}</span>
            </div>
            <div className="flex flex-wrap items-center gap-y-2 select-none">
              {site.heroCard.pipeline.map((step, i) => (
                <div key={step} className="flex items-center">
                  <span className="font-mono text-[11px] border border-mist/25 rounded-full px-3 py-1 bg-mist/10 whitespace-nowrap">
                    {step}
                  </span>
                  {i < site.heroCard.pipeline.length - 1 && (
                    <span className="flex items-center mx-1 text-mist/50">
                      <ArrowRightIcon />
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-white/10 space-y-2.5">
              {site.heroCard.stats.map((s) => (
                <div key={s.label} className="flex justify-between gap-4 text-xs">
                  <span className="text-mist/70">{s.label}</span>
                  <span className="font-mono text-white font-medium">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={`hidden sm:flex flex-col items-center gap-2 mt-16 mx-auto text-muted ${fade("0.7s")}`}>
        <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
        <span className="animate-bounce-slow">
          <ChevronIcon />
        </span>
      </div>
    </section>
  );
}
