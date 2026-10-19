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
  component: () => createElement("h1", null, "Erbium UI"),
  getParentRoute: () => rootRoute,
  path: "/",
});

const aboutRoute = createRoute({
  component: () => createElement("h1", null, "About"),
  getParentRoute: () => rootRoute,
  path: "/about",
});

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
