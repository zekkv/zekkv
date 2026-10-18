import * as Sentry from "@sentry/cloudflare";
import { wrapFetchWithSentry } from "@sentry/tanstackstart-react";
import handler from "@tanstack/react-start/server-entry";
import { env } from "./env";

export default Sentry.withSentry(
  () => ({
    dsn: env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    // v11 removed `sendDefaultPii` (its defaults match `sendDefaultPii: true`)
    // and added body collection by default; keep the old body volume.
    dataCollection: { httpBodies: [] },
  }),
  wrapFetchWithSentry(handler)
);
