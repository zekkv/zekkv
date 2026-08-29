import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import HomePage from "@/features/landing/pages/home-page";
import { SITE_ORIGIN } from "@/lib/site";

const rootRoute = getRouteApi("__root__");

const TITLE = "Charles Isaac Velasco — Backend and cloud engineer";
const DESCRIPTION =
  "I build backend systems and wire up cloud infrastructure. Penultimate-year BSc Information Systems student at Singapore Management University, taking it seriously.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:url", content: `${SITE_ORIGIN}/` },
    ],
    links: [{ rel: "canonical", href: `${SITE_ORIGIN}/` }],
  }),
  component: function HomeRoute() {
    const profile = rootRoute.useLoaderData();
    return <HomePage profile={profile} />;
  },
});
