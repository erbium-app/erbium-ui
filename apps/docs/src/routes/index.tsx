import { createFileRoute, notFound } from "@tanstack/react-router";
import { loadPage } from "@/content/load";
import { pageHead } from "@/content/head";
import { DocPageView } from "@/components/doc-page";

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

function Home() {
  return <DocPageView page={Route.useLoaderData()} />;
}
