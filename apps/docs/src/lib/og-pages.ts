import { createHash } from "node:crypto";
import { pageIndex } from "./agent-pages";

export const ogSize = { width: 1200, height: 630 };

export interface OgPage {
  route: string;
  title: string;
  description: string;
  section: string;
  imagePath: string;
}

export function plainText(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const ogPages: OgPage[] = pageIndex.map((entry) => {
  const title = entry.route === "/" ? "Introduction" : entry.title;
  const description = plainText(entry.description);
  // Version the design as well as the content so shared cards refresh after changes.
  const hash = createHash("sha256")
    .update(JSON.stringify(["erbium-og-v1", entry.route, title, description, entry.section]))
    .digest("hex")
    .slice(0, 12);
  return {
    route: entry.route,
    title,
    description,
    section: entry.section,
    imagePath: `/og/${entry.route.slice(1) || "index"}-${hash}.jpg`,
  };
});

const byRoute = new Map(ogPages.map((page) => [page.route, page]));

export function ogPageForRoute(route: string) {
  const page = byRoute.get(route.replace(/\/+$/, "") || "/");
  if (!page) throw new Error(`Missing social image metadata for ${route}`);
  return page;
}
