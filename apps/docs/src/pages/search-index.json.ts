import type { APIRoute } from "astro";
import { searchGroups } from "@/content/search-index";

export const GET: APIRoute = () =>
  new Response(JSON.stringify(searchGroups), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
