import fs from "node:fs";
import path from "node:path";

export type Link = { label: string; href: string };

export type Site = {
  name: string;
  role: string;
  location: string;
  availability: string;
  headline: string;
  headlineHighlight: string;
  intro: string;
  email: string;
  linkedin: string;
  github: string;
  resume: { label: string; file: string };
  photo: string;
  stats: { label: string; value: string }[];
  about: string[];
  research: {
    kind: string;
    title: string;
    authors: string[];
    venue: string;
    year: string;
    summary: string;
    abstract: string;
    metrics: { value: string; label: string }[];
    tags: string[];
    pdf: string;
    pdfInfo: string;
  }[];
  projectsIntro: string;
  skillsIntro: string;
  skills: { group: string; items: string[] }[];
  experience: {
    title: string;
    company: string;
    dates: string;
    note?: string;
    points: string[];
    tags: string[];
  }[];
  education: {
    degree: string;
    school: string;
    dates: string;
    thesis?: { title: string; href: string };
    badges: string[];
    coursework: string[];
  }[];
  contact: {
    intro: string;
    cardTitle: string;
    cardText: string;
    lookingFor: string[];
  };
};

export type ProjectDetail = { heading: string; points: string[] };

export type Project = {
  id: string;
  title: string;
  tag: string;
  media: string;
  mediaAlt: string;
  summary: string;
  highlights: string[];
  tech: string[];
  github: string;
  live: string;
  details: ProjectDetail[];
  demoLogin?: { label: string; fields: { name: string; value: string }[] };
  hidden: boolean;
};

const contentDir = path.join(process.cwd(), "content");
export const projectsFile = path.join(contentDir, "projects.json");

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

export function getSite(): Site {
  return readJson<Site>(path.join(contentDir, "site.json"));
}

export function getAllProjects(): Project[] {
  return readJson<Project[]>(projectsFile);
}

export function getProjects(): Project[] {
  return getAllProjects().filter((p) => !p.hidden);
}
