import { createServerFn } from "@tanstack/react-start";

export const loadPage = createServerFn({ method: "GET" })
  .validator((path: string) => path)
  .handler(async ({ data }) => {
    const { getPage } = await import("./pages.server");

    return getPage(data);
  });

export async function loadExampleSource({ data }: { data: { name: string; slug: string } }) {
  const response = await fetch(
    `/examples/${encodeURIComponent(data.name)}-${encodeURIComponent(data.slug)}.json`,
  );

  if (!response.ok) {
    throw new Error("Example source unavailable");
  }

  return await (response.json() as Promise<{ path: string; source: string }[]>);
}
