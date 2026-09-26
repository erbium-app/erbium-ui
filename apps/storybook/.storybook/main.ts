import tailwindcss from "@tailwindcss/vite";
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-docs"],
  framework: { name: "@storybook/react-vite", options: {} },
  viteFinal: (config) => {
    config.plugins = [
      ...(config.plugins ?? []),
      tailwindcss() as NonNullable<typeof config.plugins>[number],
    ];
    return config;
  },
};

export default config;
