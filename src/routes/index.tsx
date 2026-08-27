import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import HomePage from "@/features/landing/pages/home-page";

const rootRoute = getRouteApi("__root__");

export const Route = createFileRoute("/")({
  component: function HomeRoute() {
    const profile = rootRoute.useLoaderData();
    return <HomePage profile={profile} />;
  },
});
