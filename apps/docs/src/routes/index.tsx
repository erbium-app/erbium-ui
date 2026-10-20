import { createFileRoute, getRouteApi, notFound } from "@tanstack/react-router";
import { loadPage } from "@/content/load";
import { pageHead } from "@/content/head";
import { DocPageView } from "@/components/doc-page";

const routeApi = getRouteApi("/");

const Home = () => <DocPageView page={routeApi.useLoaderData()} />;

export const Route = createFileRoute("/")({
  component: Home,
  head: ({ loaderData }) => pageHead(loaderData),
  loader: async () => {
    const page = await loadPage({ data: "/" });

    if (!page) {
      throw notFound();
    }

    return page;
  },
});
