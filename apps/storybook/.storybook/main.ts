import tailwindcss from "@tailwindcss/vite";
import type { StorybookConfig } from "@storybook/tanstack-react";

const config: StorybookConfig = {
  addons: ["@storybook/addon-docs", "@storybook/addon-themes"],
  framework: { name: "@storybook/tanstack-react", options: {} },
  staticDirs: [
    "../../../packages/showcase/public",
    { from: "../../docs/public/favicon.svg", to: "/favicon.svg" },
    { from: "../../docs/public/logo.svg", to: "/logo.svg" },
  ],
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  viteFinal: (viteConfig) => {
    viteConfig.plugins = [
      ...(viteConfig.plugins ?? []),
      // SAFETY: Vite flattens nested plugin arrays, so the Tailwind plugins are one valid entry.
      // The cast only bridges the Vite types of Tailwind and Storybook.
      tailwindcss() as NonNullable<typeof viteConfig.plugins>[number],
    ];

    return viteConfig;
  },
};

export default config;
