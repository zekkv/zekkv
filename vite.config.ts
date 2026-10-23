import { defineConfig, loadEnv } from "vite";
import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

import { cloudflare } from "@cloudflare/vite-plugin";

const config = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isCi = env.CI === "true" || process.env.CI === "true";

  return {
    resolve: {
      tsconfigPaths: true,
    },
    plugins: [
      tailwindcss(),
      tanstackStart(),
      ...(isCi
        ? [
            sentryTanstackStart({
              org: env.VITE_SENTRY_ORG,
              project: env.VITE_SENTRY_PROJECT,
              authToken: env.SENTRY_AUTH_TOKEN,
              // Keep maps on disk: wrangler uploads them to Cloudflare and fails
              // the deploy when a module references a map that is missing.
              sourcemaps: { filesToDeleteAfterUpload: [] },
            }),
          ]
        : []),
      viteReact(),
      // The Workers plugin rejects vitest's SSR externals; unit tests don't need it.
      ...(process.env.VITEST
        ? []
        : [
            cloudflare({
              viteEnvironment: {
                name: "ssr",
              },
            }),
          ]),
    ],
  };
});

export default config;
