import "@/style.css";
import { createElement, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { IconSprite } from "@erbium/ui/components/icon-sprite";
import { router } from "@/router";

const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
const syncTheme = () => document.documentElement.classList.toggle("dark", colorScheme.matches);

syncTheme();

colorScheme.addEventListener("change", syncTheme);

createRoot(document.querySelector<HTMLDivElement>("#app")!).render(
  createElement(
    StrictMode,
    null,
    createElement(IconSprite),
    createElement(RouterProvider, { router }),
  ),
);
