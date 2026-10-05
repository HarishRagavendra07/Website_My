import type { Project } from "./content";

// The admin editor writes into the repo (content/ and public/), so it only
// exists while running `npm run dev` on your own machine. A deployed site has
// a read-only filesystem and must never expose these routes.
export function adminEnabled(request?: Request) {
  if (process.env.NODE_ENV === "production") return false;
  if (!request) return true;
  const host = new URL(request.url).hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

export function notFound() {
  return new Response("Not found", { status: 404 });
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const strList = (v: unknown) => (Array.isArray(v) ? v.map(str).filter(Boolean) : []);

// Normalises whatever the editor sends into a clean Project, dropping empty
// lines and unknown fields so content/projects.json stays tidy.
export function cleanProject(raw: unknown): Project {
  const p = (raw ?? {}) as Record<string, unknown>;
  const id = str(p.id).replace(/[^a-z0-9-]/gi, "").toLowerCase();
  if (!id) throw new Error("Every project needs an id");
  if (!str(p.title)) throw new Error("Every project needs a title");

  const details = (Array.isArray(p.details) ? p.details : [])
    .map((d: Record<string, unknown>) => ({ heading: str(d?.heading), points: strList(d?.points) }))
    .filter((d) => d.heading || d.points.length);

  const login = p.demoLogin as { label?: unknown; fields?: { name?: unknown; value?: unknown }[] } | undefined;
  const loginFields = (login?.fields ?? [])
    .map((f) => ({ name: str(f?.name), value: str(f?.value) }))
    .filter((f) => f.name && f.value);

  const project: Project = {
    id,
    title: str(p.title),
    tag: str(p.tag),
    media: str(p.media),
    mediaAlt: str(p.mediaAlt),
    summary: str(p.summary),
    highlights: strList(p.highlights),
    tech: strList(p.tech),
    github: str(p.github),
    live: str(p.live),
    details,
    hidden: p.hidden === true,
  };
  if (loginFields.length) project.demoLogin = { label: str(login?.label), fields: loginFields };
  return project;
}
