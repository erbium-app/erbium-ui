import { createFileRoute, notFound, useLoaderData } from "@tanstack/react-router";
import { DocPageView } from "@/components/doc-page";
import { DocPageError, DocPagePending } from "@/components/doc-page-state";
import { pageHead } from "@/content/head";
import { getDocPage } from "@/content/pages.functions";

const DocPage = () => <DocPageView page={useLoaderData({ from: "/docs/$" })} />;

export const Route = createFileRoute("/docs/$")({
  component: DocPage,
  errorComponent: DocPageError,
  head: ({ loaderData }) => pageHead(loaderData),
  loader: async ({ params }) => {
    const page = await getDocPage({ data: { path: `/docs/${params._splat}` } });

    if (!page) {
      throw notFound();
    }

    return page;
  },
  pendingComponent: DocPagePending,
});
