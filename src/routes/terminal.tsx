import { useMemo } from "react";
import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import {
  fetchEducation,
  fetchExperiences,
  fetchProjects,
  fetchToolkit,
} from "@/lib/strapi";
import { toFiles } from "@/features/terminal/files";
import TerminalPage from "@/features/terminal/pages/terminal-page";
import { SITE_ORIGIN } from "@/lib/site";

const rootRoute = getRouteApi("__root__");

const TITLE = "Terminal — Charles Isaac Velasco";
const DESCRIPTION =
  "Charles Isaac Velasco's portfolio as a virtual bash shell — every page is a markdown file to ls, cat, and grep.";

// Alternate view of the same content: noindex, and deliberately absent from SITE_ROUTES/sitemap.
export const Route = createFileRoute("/terminal")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: TITLE },
      { property: "og:url", content: `${SITE_ORIGIN}/terminal` },
    ],
    links: [{ rel: "canonical", href: `${SITE_ORIGIN}/terminal` }],
  }),
  loader: async () => {
    const [projects, experiences, education, toolkit] = await Promise.all([
      fetchProjects(),
      fetchExperiences(),
      fetchEducation(),
      fetchToolkit(),
    ]);
    return { projects, experiences, education, toolkit };
  },
  component: function TerminalRoute() {
    const profile = rootRoute.useLoaderData();
    const content = Route.useLoaderData();
    const files = useMemo(
      () => toFiles({ profile, ...content }),
      [profile, content]
    );
    return <TerminalPage files={files} />;
  },
});
