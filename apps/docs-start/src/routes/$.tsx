import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { loadPage } from "@/content/load";
import { pageHead } from "@/content/head";
import { DocPageView } from "@/components/doc-page";
export const Route = createFileRoute("/$")({
  server: {
    handlers: {
      GET: async ({ request, next }) => {
        const { resourceResponse } = await import("@/content/resources.server");
        return (await resourceResponse(request)) ?? next();
      },
    },
  },
  loader: async ({ params }) => {
    const path = `/${params._splat ?? ""}`;
    if (path === "/docs/typography" || path === "/docs/sizing")
      throw redirect({ href: path.replace("/docs/", "/docs/foundations/"), statusCode: 301 });
    const page = await loadPage({ data: path });
    if (!page) throw notFound();
    return page;
  },
  head: ({ loaderData }) => pageHead(loaderData),
  component: Page,
});
function Page() {
  return <DocPageView page={Route.useLoaderData()} />;
}
