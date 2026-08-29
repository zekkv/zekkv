import { createFileRoute } from "@tanstack/react-router";
import { fetchProjects } from "@/lib/strapi";
import ProjectsPage from "@/features/projects/pages/projects-page";
import { SITE_ORIGIN } from "@/lib/site";

const TITLE = "Work — Charles Isaac Velasco";
const DESCRIPTION =
  "Selected builds that reached real infrastructure or real users — each with its summary, responsibilities, technology stack, and source and live links.";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:url", content: `${SITE_ORIGIN}/projects` },
    ],
    links: [{ rel: "canonical", href: `${SITE_ORIGIN}/projects` }],
  }),
  loader: () => fetchProjects(),
  component: function ProjectsRoute() {
    const projects = Route.useLoaderData();
    return <ProjectsPage projects={projects} />;
  },
});
