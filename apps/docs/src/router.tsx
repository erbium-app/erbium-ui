import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const minute = 60 * 1000;

export const getRouter = () =>
  createRouter({
    defaultGcTime: 30 * minute,
    defaultPendingMinMs: 300,
    defaultPendingMs: 150,
    defaultPreload: "intent",
    defaultPreloadStaleTime: Number.POSITIVE_INFINITY,
    defaultStaleTime: Number.POSITIVE_INFINITY,
    routeTree,
    scrollRestoration: true,
  });

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
