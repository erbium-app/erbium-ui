import type { APIRoute, GetStaticPaths } from "astro";
import { createOgImage } from "@/build/seo/og-image";
import { ogPages, type OgPage } from "@/build/seo/og-pages";

export const prerender = true;

export const getStaticPaths = (() =>
  ogPages.map((page) => ({
    params: { path: page.imagePath.slice("/og/".length, -".jpg".length) },
    props: { page },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const image = await createOgImage(props.page as OgPage);
  return new Response(new Uint8Array(image), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
