import { createFileRoute } from "@tanstack/react-router";
import { env } from "@/env";
import { invalidateStrapiCache } from "@/lib/strapi";

export const Route = createFileRoute("/api/webhooks/strapi")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (
          request.headers.get("x-webhook-secret") !== env.STRAPI_WEBHOOK_SECRET
        ) {
          return new Response("Unauthorized", { status: 401 });
        }

        await invalidateStrapiCache();

        return new Response("OK", { status: 200 });
      },
    },
  },
});
