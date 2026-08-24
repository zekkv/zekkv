import type { StrapiProject } from "@/lib/strapi";
import Page from "@/components/layout/page";
import { Projects } from "../components/projects";

interface Props {
  projects: StrapiProject[];
}

export default function ProjectsPage({ projects }: Props) {
  return (
    <Page
      title="Work"
      lede="Builds that reached real infrastructure or real users — coursework and side systems kept alive past the deadline. Select a record to read it."
      wide
    >
      <Projects projects={projects} />
    </Page>
  );
}
