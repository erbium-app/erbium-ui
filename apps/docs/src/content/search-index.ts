import { components } from "./catalog";
import { kindTitles } from "./sections";
export const searchGroups = [
  {
    title: "Overview",
    items: [
      { title: "Introduction", href: "/", name: "introduction", description: "" },
      {
        title: "Roadmap",
        href: "/docs/roadmap",
        name: "roadmap",
        description: "Planned components, tools, and platforms.",
      },
    ],
  },
  {
    title: "Guides",
    items: [
      { title: "Installation", href: "/docs/installation", name: "installation", description: "" },
      {
        title: "Using components",
        href: "/docs/getting-started",
        name: "getting-started",
        description: "Compose installed components, examples, and stories.",
      },
      {
        title: "Typography",
        href: "/docs/typography",
        name: "typography",
        description: "Fonts, type roles, and Typeset reading presets.",
      },
    ],
  },
  ...(["foundation", "block", "component", "hook", "utility", "provider"] as const).map((kind) => ({
    title: kindTitles[kind],
    items: [
      ...components
        .filter((item) => item.kind === kind)
        .map(({ name, title, description, href }) => ({ name, title, description, href })),
      ...(kind === "utility"
        ? [
            {
              title: "Shimmer",
              href: "/docs/utilities/shimmer",
              name: "shimmer",
              description: "Animated text highlighting.",
            },
          ]
        : []),
    ].sort((a, b) => a.title.localeCompare(b.title)),
  })),
];
