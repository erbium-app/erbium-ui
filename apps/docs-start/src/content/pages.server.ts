import documents from "virtual:docs-pages";
export type { DocPage } from "@/build/content/pages";

export function getPage(path: string) {
  return Object.hasOwn(documents, path) ? documents[path] : null;
}
