import { createFileRoute } from "@tanstack/react-router";
import { fetchToolkit } from "@/lib/strapi";
import ToolkitPage from "@/features/toolkit/pages/toolkit-page";
import { SITE_ORIGIN } from "@/lib/site";

const TITLE = "Toolkit — Charles Isaac Velasco";
const DESCRIPTION =
  "The languages, cloud platforms, and frameworks Charles Isaac Velasco reaches for, grouped by the job each one does.";

export const Route = createFileRoute("/toolkit")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:url", content: `${SITE_ORIGIN}/toolkit` },
    ],
    links: [{ rel: "canonical", href: `${SITE_ORIGIN}/toolkit` }],
  }),
  loader: () => fetchToolkit(),
  component: function ToolkitRoute() {
    const toolkit = Route.useLoaderData();
    return <ToolkitPage toolkit={toolkit} />;
  },
});
