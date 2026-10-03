import type { Meta, StoryObj } from "../types";

import { CSPProvider } from "@erbium/ui/components/csp-provider";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import ExternalStylesExample from "./variants/external-styles";

import ExternalStylesSource from "./variants/external-styles.tsx?raw";

import ShowcaseExample from "./variants/showcase";

import ShowcaseSource from "./variants/showcase.tsx?raw";

const meta = {
  component: CSPProvider,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("csp-provider"),
      },
    },
  },
} satisfies Meta<typeof CSPProvider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ExternalStyles: Story = {
  args: { disableStyleElements: true },
  parameters: {
    docs: {
      description: { story: variantDocumentation("csp-provider", "external-styles") },
      source: { code: ExternalStylesSource },
    },
  },
  render: ExternalStylesExample,
};

export const Showcase: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("csp-provider", "showcase") },
      source: { code: ShowcaseSource },
    },
  },
  render: ShowcaseExample,
};
