import { createFileRoute } from "@tanstack/react-router";
import { fetchEducation } from "@/lib/strapi";
import EducationPage from "@/features/education/pages/education-page";
import { SITE_ORIGIN } from "@/lib/site";

const TITLE = "Education — Charles Isaac Velasco";
const DESCRIPTION =
  "A BSc in Information Systems at Singapore Management University, plus the schooling that came before it.";

export const Route = createFileRoute("/education")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:url", content: `${SITE_ORIGIN}/education` },
    ],
    links: [{ rel: "canonical", href: `${SITE_ORIGIN}/education` }],
  }),
  loader: () => fetchEducation(),
  component: function EducationRoute() {
    const education = Route.useLoaderData();
    return <EducationPage education={education} />;
  },
});
