import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminEnabled } from "@/lib/admin";
import { getAllProjects } from "@/lib/content";
import ProjectEditor from "./ProjectEditor";

export const metadata: Metadata = {
  title: "Edit projects",
  robots: { index: false },
};

export default function AdminPage() {
  if (!adminEnabled()) notFound();
  return <ProjectEditor initial={getAllProjects()} />;
}
