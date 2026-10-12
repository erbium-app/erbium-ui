import { createFileRoute, notFound } from "@tanstack/react-router";
import { loadPage } from "@/content/load";
import { pageHead } from "@/content/head";
import { DocPageView } from "@/components/doc-page";
export const Route = createFileRoute("/")({
  loader: async () => {
    const page = await loadPage({ data: "/" });
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => pageHead(loaderData),
  component: Home,
});
function Home() {
  return <DocPageView page={Route.useLoaderData()} />;
}
