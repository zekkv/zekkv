import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { preconnect } from "react-dom";
import Chrome from "../components/custom/chrome";
import { ThemeProvider } from "next-themes";
import { fetchUserProfile } from "@/lib/strapi";
import { SITE_ORIGIN } from "@/lib/site";

import appCss from "../globals.css?url";

// Google Fonts as a document-level <link>, not a CSS @import — see globals.css.
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Hanken+Grotesk:wght@400;500;600&family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400&display=swap";

// Site-wide fallback copy. Every route overrides title/description with its own.
const DEFAULT_TITLE = "Charles Isaac Velasco";
const DEFAULT_DESCRIPTION =
  "Charles Isaac Velasco builds backend systems and the cloud they run on. Information Systems student at SMU, Singapore. Previously EIU Industry 4.0 Innovation Center.";

export const Route = createRootRoute({
  head: ctx => {
    const profile = ctx.loaderData;
    const sameAs = [profile?.github, profile?.linkedin].filter(Boolean);
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "robots", content: "index, follow" },
        { title: DEFAULT_TITLE },
        { name: "description", content: DEFAULT_DESCRIPTION },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Charles Isaac Velasco" },
        { property: "og:locale", content: "en_US" },
        { property: "og:title", content: DEFAULT_TITLE },
        // No og:description here — unfurlers fall back to each route's own
        // <meta name="description">, so shared inner-page links carry that
        // page's description rather than one site-wide sentence.
        { property: "og:image", content: `${SITE_ORIGIN}/og.png` },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:alt", content: "Charles Isaac Velasco" },
        // No twitter:title / twitter:description — X, Slack, etc. fall back to
        // the per-route og:title / og:description, which is what we want.
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: `${SITE_ORIGIN}/og.png` },
        {
          name: "theme-color",
          content: "#f7f7f4",
          media: "(prefers-color-scheme: light)",
        },
        {
          name: "theme-color",
          content: "#121514",
          media: "(prefers-color-scheme: dark)",
        },
        {
          "script:ld+json": {
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": `${SITE_ORIGIN}/#website`,
                url: `${SITE_ORIGIN}/`,
                name: "Charles Isaac Velasco",
                publisher: { "@id": `${SITE_ORIGIN}/#person` },
              },
              {
                "@type": "Person",
                "@id": `${SITE_ORIGIN}/#person`,
                name: profile?.name ?? "Charles Isaac Velasco",
                url: `${SITE_ORIGIN}/`,
                jobTitle: "Backend and cloud engineer",
                ...(sameAs.length > 0 ? { sameAs } : {}),
                alumniOf: {
                  "@type": "CollegeOrUniversity",
                  name: "Singapore Management University",
                },
                knowsAbout: [
                  "Backend development",
                  "Cloud infrastructure",
                  "Distributed systems",
                ],
              },
            ],
          },
        },
      ],
      links: [
        // Font-origin preconnects are issued from RootDocument (see there).
        { rel: "stylesheet", href: FONTS_HREF },
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      ],
    };
  },
  loader: () => fetchUserProfile(),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  // Warm DNS/TLS to the font origins ahead of the font stylesheet request.
  preconnect("https://fonts.googleapis.com");
  preconnect("https://fonts.gstatic.com", { crossOrigin: "anonymous" });

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
