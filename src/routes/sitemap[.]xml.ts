import { createFileRoute } from "@tanstack/react-router";
import { SITE_ORIGIN, SITE_ROUTES } from "@/lib/site";

// Fixed set of routes — generate the string at request time. No build artifact,
// no plugin sitemap generator. If per-project routes ever land, enumerate them here.
const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITE_ROUTES.map(p => `  <url><loc>${SITE_ORIGIN}${p}</loc></url>`).join("\n")}
</urlset>
`;

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(body, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=86400",
          },
        }),
    },
  },
});
