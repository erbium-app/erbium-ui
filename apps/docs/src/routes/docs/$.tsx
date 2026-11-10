import { createFileRoute, notFound, useLoaderData } from "@tanstack/react-router";
import { DocPageView } from "@/components/doc-page";
import { DocPageError } from "@/components/doc-page-state";
import { pageHead } from "@/content/head";
import { getDocPage } from "@/content/pages";

const DocPage = () => <DocPageView page={useLoaderData({ from: "/docs/$" })} />;

export const Route = createFileRoute("/docs/$")({
  component: DocPage,
  errorComponent: DocPageError,
  head: ({ loaderData }) => pageHead(loaderData),
  loader: async ({ params }) => {
    const page = await getDocPage(`/docs/${params._splat}`);

    if (!page) {
      throw notFound();
    }

    return page;
  },
});
