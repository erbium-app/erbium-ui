import { createFileRoute, notFound, useLoaderData } from "@tanstack/react-router";
import { DocPageView } from "@/components/doc-page";
import { DocPageError, DocPagePending } from "@/components/doc-page-state";
import { pageHead } from "@/content/head";
import { getDocPage } from "@/content/pages";

const Home = () => <DocPageView page={useLoaderData({ from: "/" })} />;

export const Route = createFileRoute("/")({
  component: Home,
  errorComponent: DocPageError,
  head: ({ loaderData }) => pageHead(loaderData),
  loader: async () => {
    const page = await getDocPage("/");

    if (!page) {
      throw notFound();
    }

    return page;
  },
  pendingComponent: DocPagePending,
});
