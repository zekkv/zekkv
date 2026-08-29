// Site-wide invariants. Adding a route? Add its path here and give the route
// file its own head() with a title, description, og:title, og:url, and canonical.
export const SITE_ORIGIN = "https://ciav.dev";

export const SITE_ROUTES = [
  "/",
  "/projects",
  "/experience",
  "/education",
  "/toolkit",
] as const;
