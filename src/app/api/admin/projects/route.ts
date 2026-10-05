import fs from "node:fs/promises";
import { adminEnabled, cleanProject, notFound } from "@/lib/admin";
import { getAllProjects, projectsFile } from "@/lib/content";

export async function GET(request: Request) {
  if (!adminEnabled(request)) return notFound();
  return Response.json(getAllProjects());
}

export async function PUT(request: Request) {
  if (!adminEnabled(request)) return notFound();

  let projects;
  try {
    const body = await request.json();
    if (!Array.isArray(body)) throw new Error("Expected a list of projects");
    projects = body.map(cleanProject);
    const ids = new Set(projects.map((p) => p.id));
    if (ids.size !== projects.length) throw new Error("Two projects share the same id");
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 400 });
  }

  await fs.writeFile(projectsFile, JSON.stringify(projects, null, 2) + "\n");
  return Response.json(projects);
}
