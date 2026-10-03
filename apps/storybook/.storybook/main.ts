import tailwindcss from "@tailwindcss/vite";
import type { StorybookConfig } from "@storybook/tanstack-react";

const config: StorybookConfig = {
  staticDirs: ["../../../packages/showcase/public"],
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-themes"],
  framework: { name: "@storybook/tanstack-react", options: {} },
  viteFinal: (config) => {
    config.plugins = [
      ...(config.plugins ?? []),
      tailwindcss() as NonNullable<typeof config.plugins>[number],
    ];
    return config;
  },
};

export default config;
