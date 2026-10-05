import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Research from "@/components/Research";
import { About, Contact, Education, Experience, Projects, Skills } from "@/components/Sections";
import { getProjects, getSite } from "@/lib/content";

export default function Home() {
  const site = getSite();
  const projects = getProjects();

  return (
    <div className="min-h-screen bg-bg text-ink">
      <Header name={site.name} resume={site.resume.file} />
      <Hero site={site} />
      <About site={site} />
      <Research site={site} />
      <Projects site={site} projects={projects} />
      <Skills site={site} />
      <Experience site={site} />
      <Education site={site} />
      <Contact site={site} />
    </div>
  );
}
