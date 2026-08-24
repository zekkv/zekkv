import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import Chrome from "../components/custom/chrome";
import { ThemeProvider } from "next-themes";

import appCss from "../globals.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      { title: "Charles Isaac Velasco" },
      {
        name: "description",
        content:
          "Charles Isaac Velasco builds backend systems and the cloud they run on. Information Systems student at SMU, Singapore. Previously EIU Industry 4.0 Innovation Center.",
      },
      { property: "og:title", content: "Charles Isaac Velasco" },
      {
        property: "og:description",
        content:
          "Backend systems and cloud infrastructure. Information Systems student at SMU, Singapore.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          storageKey="portfolio-theme"
        >
          <Chrome>{children}</Chrome>
        </ThemeProvider>
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        )}
        <Scripts />
        <script
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "16f5bad4e90d4bb188bc4cb40c4835bc"}'
        />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center px-8">
      <div className="max-w-md">
        <p className="font-mono text-xs text-graphite">404</p>
        <p className="mt-4 font-display text-2xl">This page doesn't exist.</p>
        <a href="/" className="quiet-link mt-6 inline-block">
          Back to the index
        </a>
      </div>
    </section>
  );
}
