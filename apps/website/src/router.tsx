import { createElement } from "react";
import { createRootRoute, createRoute, createRouter, Link, Outlet } from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () =>
    createElement(
      "main",
      null,
      createElement(
        "nav",
        null,
        createElement(Link, { to: "/" }, "Home"),
        " ",
        createElement(Link, { to: "/about" }, "About"),
      ),
      createElement(Outlet),
    ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => createElement("h1", null, "Erbium UI"),
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: () => createElement("h1", null, "About"),
});
const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
