# Portfolio

Personal portfolio built with Next.js + Tailwind CSS, deployed on Vercel.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

## Edit your projects

Open **http://localhost:3000/admin** while `npm run dev` is running.

- **+ New project** adds a project. New projects start hidden; tick **Show on site** to publish.
- Upload an image, GIF or video (mp4/webm, up to 50 MB). It is saved to `public/projects/<project-id>/`.
- Highlights, tech stack and "Read more" points take one item per line.
- Use ↑ / ↓ to reorder. The card numbers (01, 02, …) follow this order.
- **Save changes** writes everything to `content/projects.json`. The right-hand column shows a live preview.

You can also edit `content/projects.json` by hand. The admin page only exists in development. On the deployed site it returns 404, so nobody else can change your projects.

## Edit everything else

All other text lives in `content/site.json`: name, headline, hero stats, about, skills, experience, education and contact. Replace `public/resumes/Harish-Ragavendra-Resume.pdf` to update the resume. If you rename it, change `resume.file` to match. Leave `linkedin` empty to hide the LinkedIn links.

## Publish

Commit `content/` and `public/projects/`, then push. Vercel rebuilds the site on every push.

```bash
git add content public && git commit -m "Update projects" && git push
```
