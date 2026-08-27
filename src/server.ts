import * as Sentry from "@sentry/cloudflare";
import { wrapFetchWithSentry } from "@sentry/tanstackstart-react";
import handler from "@tanstack/react-start/server-entry";
import { env } from "./env";

export default Sentry.withSentry(
  () => ({
    dsn: env.SENTRY_DSN,
    sendDefaultPii: true,
    tracesSampleRate: 1.0,
    enableLogs: true,
  }),
  // @ts-expect-error - TanStack's handler isn't typed as a Cloudflare ExportedHandler
  wrapFetchWithSentry(handler)
);
