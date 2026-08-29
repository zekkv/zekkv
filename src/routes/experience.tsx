import { createFileRoute } from "@tanstack/react-router";
import { fetchExperiences } from "@/lib/strapi";
import ExperiencePage from "@/features/experience/pages/experience-page";
import { SITE_ORIGIN } from "@/lib/site";

const TITLE = "Experience — Charles Isaac Velasco";
const DESCRIPTION =
  "Where Charles Isaac Velasco has worked, including the EIU Industry 4.0 Innovation Center, with the responsibilities held in each role.";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:url", content: `${SITE_ORIGIN}/experience` },
    ],
    links: [{ rel: "canonical", href: `${SITE_ORIGIN}/experience` }],
  }),
  loader: () => fetchExperiences(),
  component: function ExperienceRoute() {
    const experiences = Route.useLoaderData();
    return <ExperiencePage experiences={experiences} />;
  },
});
