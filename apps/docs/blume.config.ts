import { defineConfig } from "blume";

export default defineConfig({
  title: "Erbium UI",
  description: "A modern, accessible React component library.",
  logo: "/logo.svg",
  content: { root: "content" },
  navigation: { tabs: [{ label: "Docs", path: "/docs" }] },
  theme: { accent: "blue", radius: "lg" },
});
