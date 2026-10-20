import { createServerFn } from "@tanstack/react-start";
import { getPage } from "./pages.server";

export interface DocPageInput {
  path: string;
}

export const getDocPage = createServerFn({ method: "GET" })
  .validator((input: DocPageInput) => input)
  .handler(({ data }) => getPage(data.path));
