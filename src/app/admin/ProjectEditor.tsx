"use client";

import Link from "next/link";
import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/lib/content";

const input =
  "w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-ink focus:outline-none focus:border-electric-blue";
const label = "block text-xs font-medium text-muted mb-1";
const smallBtn = "text-xs px-2 py-1 rounded border border-border hover:border-ink disabled:opacity-30";

function blankProject(): Project {
  return {
    id: `project-${Date.now().toString(36)}`,
    title: "Untitled project",
    tag: "Personal",
    media: "",
    mediaAlt: "",
    summary: "",
    highlights: [],
    tech: [],
    github: "",
    live: "",
    details: [],
    hidden: true,
  };
}

const lines = (v: string) => v.split("\n");

function Field({ name, hint, children }: { name: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={label}>
        {name}
        {hint && <span className="font-normal text-muted/80"> — {hint}</span>}
      </span>
      {children}
    </label>
  );
}

export default function ProjectEditor({ initial }: { initial: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initial);
  const [selected, setSelected] = useState<string | null>(initial[0]?.id ?? null);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<{ kind: "ok" | "error" | "busy"; text: string } | null>(null);

  const current = projects.find((p) => p.id === selected) ?? null;
  const currentIndex = projects.findIndex((p) => p.id === selected);
  const visibleIndex = projects.filter((p) => !p.hidden).findIndex((p) => p.id === selected);

  function update(patch: Partial<Project>) {
    setProjects((ps) => ps.map((p) => (p.id === selected ? { ...p, ...patch } : p)));
    setDirty(true);
  }

  function move(from: number, to: number) {
    setProjects((ps) => {
      const next = [...ps];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
    setDirty(true);
  }

  function add() {
    const p = blankProject();
    setProjects((ps) => [...ps, p]);
    setSelected(p.id);
    setDirty(true);
  }

  function remove() {
    if (!current || !confirm(`Delete "${current.title}"? Uploaded files stay in public/projects/${current.id}/.`)) return;
    const rest = projects.filter((p) => p.id !== current.id);
    setProjects(rest);
    setSelected(rest[0]?.id ?? null);
    setDirty(true);
  }

  async function save() {
    setStatus({ kind: "busy", text: "Saving…" });
    const res = await fetch("/api/admin/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projects),
    });
    const data = await res.json();
    if (!res.ok) return setStatus({ kind: "error", text: data.error ?? "Save failed" });
    setProjects(data);
    setDirty(false);
    setStatus({ kind: "ok", text: "Saved to content/projects.json" });
  }

  async function upload(file: File) {
    if (!current) return;
    setStatus({ kind: "busy", text: `Uploading ${file.name}…` });
    const form = new FormData();
    form.append("file", file);
    form.append("projectId", current.id);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) return setStatus({ kind: "error", text: data.error ?? "Upload failed" });
    update({ media: data.path, mediaAlt: current.mediaAlt || `Screenshot of ${current.title}` });
    setStatus({ kind: "ok", text: "Uploaded — remember to save" });
  }

  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="sticky top-0 z-10 bg-bg border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-muted hover:text-ink">
              ← Site
            </Link>
            <h1 className="font-medium">Edit projects</h1>
          </div>
          <div className="flex items-center gap-3">
            {status && (
              <span
                className={`text-xs ${status.kind === "error" ? "text-red-600" : status.kind === "ok" ? "text-green-700" : "text-muted"}`}
              >
                {status.text}
              </span>
            )}
            <button
              onClick={save}
              disabled={!dirty || status?.kind === "busy"}
              className="text-sm px-3 py-1.5 rounded-btn bg-ink text-bg hover:bg-ink/85 disabled:opacity-40"
            >
              {dirty ? "Save changes" : "Saved"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 py-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_minmax(0,1fr)]">
        {/* Project list */}
        <aside className="space-y-2">
          <button onClick={add} className="w-full text-sm px-3 py-2 rounded-md border border-dashed border-ink/30 hover:border-ink">
            + New project
          </button>
          <ol className="space-y-1">
            {projects.map((p, i) => (
              <li key={p.id}>
                <div
                  className={`flex items-center gap-1 rounded-md border px-2 py-1.5 ${p.id === selected ? "border-electric-blue bg-bg" : "border-border bg-card"}`}
                >
                  <button onClick={() => setSelected(p.id)} className="flex-1 text-left text-sm truncate">
                    <span className={p.hidden ? "text-muted line-through" : ""}>{p.title}</span>
                  </button>
                  <button aria-label="Move up" className={smallBtn} disabled={i === 0} onClick={() => move(i, i - 1)}>
                    ↑
                  </button>
                  <button
                    aria-label="Move down"
                    className={smallBtn}
                    disabled={i === projects.length - 1}
                    onClick={() => move(i, i + 1)}
                  >
                    ↓
                  </button>
                </div>
              </li>
            ))}
          </ol>
          {projects.length === 0 && <p className="text-xs text-muted">No projects yet.</p>}
        </aside>

        {/* Form */}
        {current ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!current.hidden} onChange={(e) => update({ hidden: !e.target.checked })} />
                Show on site
              </label>
              <button onClick={remove} className="text-xs text-red-600 hover:underline">
                Delete project
              </button>
            </div>

            <Field name="Title">
              <input className={input} value={current.title} onChange={(e) => update({ title: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field name="Tag" hint="Personal, Academic, Work…">
                <input className={input} value={current.tag} onChange={(e) => update({ tag: e.target.value })} />
              </Field>
              <Field name="Id" hint="folder name for uploads">
                <input className={`${input} text-muted`} value={current.id} readOnly />
              </Field>
            </div>

            <div className="rounded-md border border-border bg-card p-3 space-y-3">
              <span className={label}>Image, GIF or video</span>
              <input
                type="file"
                accept="image/*,video/mp4,video/webm"
                className="block text-sm"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload(f);
                  e.target.value = "";
                }}
              />
              <Field name="Media path" hint="filled in by upload, or paste a URL">
                <input className={input} value={current.media} onChange={(e) => update({ media: e.target.value })} />
              </Field>
              <Field name="Alt text" hint="describe what the media shows">
                <input className={input} value={current.mediaAlt} onChange={(e) => update({ mediaAlt: e.target.value })} />
              </Field>
            </div>

            <Field name="Summary" hint="2–3 sentences: what it is and who it's for">
              <textarea rows={3} className={input} value={current.summary} onChange={(e) => update({ summary: e.target.value })} />
            </Field>
            <Field name="Highlights" hint="one per line">
              <textarea
                rows={4}
                className={input}
                value={current.highlights.join("\n")}
                onChange={(e) => update({ highlights: lines(e.target.value) })}
              />
            </Field>
            <Field name="Tech stack" hint="one per line">
              <textarea rows={4} className={input} value={current.tech.join("\n")} onChange={(e) => update({ tech: lines(e.target.value) })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field name="GitHub URL">
                <input className={input} value={current.github} onChange={(e) => update({ github: e.target.value })} />
              </Field>
              <Field name="Live demo URL">
                <input className={input} value={current.live} onChange={(e) => update({ live: e.target.value })} />
              </Field>
            </div>

            <div className="rounded-md border border-border bg-card p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className={label}>&ldquo;Read more&rdquo; sections</span>
                <button className={smallBtn} onClick={() => update({ details: [...current.details, { heading: "", points: [] }] })}>
                  + Section
                </button>
              </div>
              {current.details.map((d, i) => (
                <div key={i} className="space-y-2 rounded-md bg-bg border border-border p-2">
                  <div className="flex gap-2">
                    <input
                      className={input}
                      placeholder="Heading, e.g. Architecture"
                      value={d.heading}
                      onChange={(e) =>
                        update({ details: current.details.map((x, j) => (j === i ? { ...x, heading: e.target.value } : x)) })
                      }
                    />
                    <button
                      className={smallBtn}
                      aria-label="Remove section"
                      onClick={() => update({ details: current.details.filter((_, j) => j !== i) })}
                    >
                      ✕
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    className={input}
                    placeholder="Points, one per line"
                    value={d.points.join("\n")}
                    onChange={(e) =>
                      update({ details: current.details.map((x, j) => (j === i ? { ...x, points: lines(e.target.value) } : x)) })
                    }
                  />
                </div>
              ))}
            </div>

            <div className="rounded-md border border-border bg-card p-3 space-y-3">
              <span className={label}>Demo login box (optional)</span>
              <input
                className={input}
                placeholder="Label, e.g. Try it yourself — demo login"
                value={current.demoLogin?.label ?? ""}
                onChange={(e) => update({ demoLogin: { label: e.target.value, fields: current.demoLogin?.fields ?? [] } })}
              />
              <textarea
                rows={2}
                className={input}
                placeholder={"Email: demo@example.com\nPassword: demo1234"}
                value={(current.demoLogin?.fields ?? []).map((f) => (f.value ? `${f.name}: ${f.value}` : f.name)).join("\n")}
                onChange={(e) =>
                  update({
                    demoLogin: {
                      label: current.demoLogin?.label ?? "",
                      fields: lines(e.target.value).map((l) => {
                        const at = l.indexOf(":");
                        return at === -1 ? { name: l, value: "" } : { name: l.slice(0, at), value: l.slice(at + 1).trimStart() };
                      }),
                    },
                  })
                }
              />
            </div>
          </section>
        ) : (
          <p className="text-sm text-muted">Create a project to start editing.</p>
        )}

        {/* Live preview */}
        <section>
          <p className={label}>Preview{current?.hidden && " (hidden — tick “Show on site” to publish)"}</p>
          {current && (
            <div className="lg:sticky lg:top-20">
              <ProjectCard
                project={{
                  ...current,
                  highlights: current.highlights.filter((s) => s.trim()),
                  tech: current.tech.filter((s) => s.trim()),
                }}
                index={current.hidden ? currentIndex : visibleIndex}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
