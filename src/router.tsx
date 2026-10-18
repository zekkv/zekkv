import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import * as Sentry from "@sentry/tanstackstart-react";
import { env } from "./env";

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    // Short window so hovering across the nav reuses a preload instead of
    // refetching once per hover event.
    defaultPreloadStaleTime: 10_000,
  });

  // Initialize Sentry on the client only (not during SSR)
  if (!router.isServer) {
    const globalState = globalThis as typeof globalThis & {
      __appSentryInitialized__?: boolean;
    };

    const sentryDsn = env.VITE_SENTRY_DSN;

    if (!globalState.__appSentryInitialized__ && sentryDsn) {
      Sentry.init({
        dsn: sentryDsn,
        integrations: [
          Sentry.tanstackRouterBrowserTracingIntegration(router),
          // Session Replay ships DOM-mutation recording + observers to every
          // visitor — load it for ~10% of sessions rather than all of them.
          ...(Math.random() < 0.1 ? [Sentry.replayIntegration()] : []),
        ],
        tracesSampleRate: 0.1,
        // The 10% roll above is the session sample; record the ones that pass.
        replaysSessionSampleRate: 1.0,
        replaysOnErrorSampleRate: 1.0,
        // v11 dropped `sendDefaultPii` and collects most categories by
        // default; this keeps the restrictive v10 `sendDefaultPii: false`
        // posture. Baseline copied from the v10 -> v11 migration guide.
        dataCollection: {
          userInfo: false,
          cookies: false,
          httpHeaders: {
            request: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
            response: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
          },
          httpBodies: [],
          urlQueryParams: {
            deny: ["forwarded", "-ip", "remote-", "via", "-user"],
          },
          genAI: { inputs: false, outputs: false },
          databaseQueryData: false,
          graphQL: { document: false, variables: false },
        },
      });
      globalState.__appSentryInitialized__ = true;
    }
  }

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
