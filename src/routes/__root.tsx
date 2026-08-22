import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import Navbar from "../components/custom/navbar";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "../components/ui/tooltip";

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
          "Portfolio of Charles Isaac Velasco, an Information Systems student at SMU focused on cloud infrastructure, modern developer tools, and production-ready cloud-native applications.",
      },
      {
        property: "og:title",
        content: "Charles Isaac Velasco",
      },
      {
        property: "og:description",
        content:
          "Portfolio of Charles Isaac Velasco, an Information Systems student at SMU focused on cloud infrastructure, modern developer tools, and production-ready cloud-native applications.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      {
        name: "twitter:title",
        content: "Charles Isaac Velasco",
      },
      {
        name: "twitter:description",
        content:
          "Portfolio of Charles Isaac Velasco, an Information Systems student at SMU focused on cloud infrastructure and cloud-native applications.",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23000'/%3E%3Ctext x='16' y='22' font-family='serif' font-size='18' font-weight='700' text-anchor='middle' fill='%23fff'%3EC%3C/text%3E%3C/svg%3E",
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => <div>404 Not Found</div>,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased bg-background text-foreground selection:bg-foreground selection:text-background w-full">
        <div className="obsidian-grain" />
        <div className="precision-grid" />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          storageKey="portfolio-theme"
        >
          <TooltipProvider>
            <Navbar />
            {children}
          </TooltipProvider>
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
