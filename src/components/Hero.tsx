import type { Site } from "@/lib/content";
import NeuralBackground from "./NeuralBackground";
import { ChevronIcon, DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon, SparkleIcon } from "./icons";
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
    site.github && { href: site.github, label: "GitHub", Icon: GitHubIcon, external: true },
    site.linkedin && { href: site.linkedin, label: "LinkedIn", Icon: LinkedInIcon, external: true },
    site.email && { href: `mailto:${site.email}`, label: "Email", Icon: MailIcon, external: false },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof MailIcon; external: boolean }[];
}

// Small nodes riding the orbit ring around the portrait.
const orbitNodes = [
  "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-electric-blue",
  "bottom-[14%] left-[3%] bg-violet",
  "top-[30%] right-0 translate-x-1/2 bg-cyan",
];

function Portrait({ site }: { site: Site }) {
  return (
    <div className="relative w-[240px] sm:w-[300px] lg:w-[360px] aspect-square mx-auto">
      <div className="absolute -inset-5 sm:-inset-7 rounded-full border border-dashed border-electric-blue/30 animate-spin-slow">
        {orbitNodes.map((pos) => (
          <span key={pos} className={`absolute w-2.5 h-2.5 rounded-full shadow-[0_0_12px_2px] shadow-electric-blue/40 ${pos}`} />
        ))}
      </div>
      <div className="absolute -inset-12 sm:-inset-16 rounded-full border border-border animate-spin-slower" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-electric-blue/30 via-violet/20 to-cyan/30 blur-2xl" />
      {site.photo ? (
        // eslint-disable-next-line @next/next/no-img-element -- the photo path comes from site.json
        <img
          src={site.photo}
          alt={site.name}
          className="relative w-full h-full rounded-full object-cover border-4 border-bg shadow-2xl"
        />
      ) : (
        <div className="relative w-full h-full rounded-full border-4 border-bg bg-card shadow-2xl" />
      )}
      <div className="absolute bottom-[6%] -right-2 sm:-right-6 flex items-center gap-2 rounded-full border border-border bg-bg/90 backdrop-blur px-4 py-2 shadow-lg">
        <span className="relative flex w-2 h-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
          <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-500" />
        </span>
        <span className="text-[13px] text-ink whitespace-nowrap">Available for hire</span>
      </div>
    </div>
  );
}

export default function Hero({ site }: { site: Site }) {
  const socials = socialLinks(site);

  return (
    <section id="top" aria-label="Introduction" className="relative overflow-hidden">
      <NeuralBackground className="absolute inset-0 w-full h-full opacity-80 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]" />
      <div className="relative min-h-screen flex flex-col justify-center px-4 pt-28 pb-16 max-w-[1200px] mx-auto">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-16 lg:gap-10 items-center">
          <div className="order-2 lg:order-1 max-w-2xl">
            <span
              className={`inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-md border border-border bg-card text-ink mb-7 ${fade("0s")}`}
            >
              <SparkleIcon className="w-3.5 h-3.5 text-electric-blue" />
              {site.availability}
            </span>
            <h1
              className={`font-heading font-medium text-[44px] sm:text-[58px] lg:text-[68px] text-ink leading-[1.02] tracking-[-0.04em] mb-6 ${fade("0.1s")}`}
            >
              Hello, I&apos;m
              <br />
              {site.name}
            </h1>
            <p className={`text-lg sm:text-[22px] text-muted mb-4 leading-snug ${fade("0.2s")}`}>
              {site.headline} <span className="ai-gradient font-medium">{site.headlineHighlight}</span>
            </p>
            <p className={`text-base text-muted mb-8 leading-relaxed max-w-xl ${fade("0.3s")}`}>{site.intro}</p>
            <div className={`flex flex-wrap gap-3 mb-8 ${fade("0.4s")}`}>
              <a href={site.resume.file} download className={`${btnPrimary} flex items-center gap-2`}>
                <DownloadIcon /> Download Resume
              </a>
              <a href="#projects" className={btnOutline}>
                View My Work
              </a>
            </div>
            <div className={`flex items-center gap-3 mb-12 ${fade("0.5s")}`}>
              {socials.map(({ href, label, Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  title={label}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center justify-center w-11 h-11 rounded-full border border-border bg-bg text-ink hover:border-electric-blue hover:text-electric-blue transition-colors"
                >
                  <Icon />
                </a>
              ))}
            </div>
            {site.stats.length > 0 && (
              <dl className={`grid grid-cols-3 gap-6 max-w-md ${fade("0.6s")}`}>
                {site.stats.map((s) => (
                  <div key={s.label} className="flex flex-col-reverse">
                    <dt className="text-xs sm:text-sm text-muted mt-1">{s.label}</dt>
                    <dd className="text-[26px] sm:text-[30px] font-medium tracking-[-0.03em] text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className={`order-1 lg:order-2 py-10 ${fade("0.35s")}`}>
            <Portrait site={site} />
          </div>
        </div>
        <a
          href="#about"
          className={`hidden sm:flex flex-col items-center gap-2 mt-14 mx-auto text-muted hover:text-ink transition-colors ${fade("0.7s")}`}
        >
          <span className="text-xs uppercase tracking-wider">Scroll to explore</span>
          <span className="animate-bounce-slow">
            <ChevronIcon />
          </span>
        </a>
      </div>
    </section>
  );
}
