import fs from "node:fs/promises";
import path from "node:path";
import { adminEnabled, notFound } from "@/lib/admin";

const MAX_BYTES = 50 * 1024 * 1024;
const ALLOWED = /\.(png|jpe?g|gif|webp|avif|svg|mp4|webm)$/i;

export async function POST(request: Request) {
  if (!adminEnabled(request)) return notFound();

  const form = await request.formData();
  const file = form.get("file");
  const projectId = String(form.get("projectId") ?? "").replace(/[^a-z0-9-]/gi, "").toLowerCase();

  if (!(file instanceof File) || !projectId) {
    return Response.json({ error: "Missing file or project id" }, { status: 400 });
  }
  if (!ALLOWED.test(file.name)) {
    return Response.json({ error: "Upload an image (png, jpg, gif, webp, avif, svg) or video (mp4, webm)" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "File is larger than 50 MB — compress it first" }, { status: 400 });
  }

  const ext = path.extname(file.name).toLowerCase();
  const base = path.basename(file.name, ext).replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase() || "media";
  const dir = path.join(process.cwd(), "public", "projects", projectId);
  await fs.mkdir(dir, { recursive: true });

  const name = `${base}-${Date.now()}${ext}`;
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return Response.json({ path: `/projects/${projectId}/${name}` });
}
