import { notFound } from "next/navigation";
import ProjectDetail from "../../components/ProjectDetail";
import { projects } from "../../data/content";

type Params = {
  slug: string;
};

export default function ProjectPage({ params }: { params: Params }) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}

