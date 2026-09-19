import "@/style.css";
import { createElement, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/router";

createRoot(document.querySelector<HTMLDivElement>("#app")!).render(
  createElement(StrictMode, null, createElement(RouterProvider, { router })),
);
