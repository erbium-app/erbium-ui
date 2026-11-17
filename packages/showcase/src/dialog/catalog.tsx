import ProgrammaticExample from "./variants/programmatic";
import ProgrammaticSource from "./variants/programmatic.tsx?raw";
import { Dialog } from "@erbium/ui/components/dialog";

import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/dialog-demo.tsx?raw";

import CustomCloseButtonExample from "./variants/custom-close-button";

import CustomCloseButtonSource from "./examples/dialog-close-button.tsx?raw";

import NoCloseButtonExample from "./variants/no-close-button";

import NoCloseButtonSource from "./examples/dialog-no-close-button.tsx?raw";

import StickyFooterExample from "./variants/sticky-footer";

import StickyFooterSource from "./examples/dialog-sticky-footer.tsx?raw";

import ScrollableContentExample from "./variants/scrollable-content";

import ScrollableContentSource from "./examples/dialog-scrollable-content.tsx?raw";

const meta = {
  component: Dialog,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("dialog"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<{ defaultOpen: boolean; showCloseButton: boolean }> = {
  argTypes: { defaultOpen: { control: "boolean" }, showCloseButton: { control: "boolean" } },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("dialog", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("dialog", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const CustomCloseButton: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("dialog", "custom-close-button") },
      source: { code: CustomCloseButtonSource },
    },
  },
  render: CustomCloseButtonExample,
};

export const NoCloseButton: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("dialog", "no-close-button") },
      source: { code: NoCloseButtonSource },
    },
  },
  render: NoCloseButtonExample,
};

export const StickyFooter: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("dialog", "sticky-footer") },
      source: { code: StickyFooterSource },
    },
  },
  render: StickyFooterExample,
};

export const ScrollableContent: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("dialog", "scrollable-content") },
      source: { code: ScrollableContentSource },
    },
  },
  render: ScrollableContentExample,
};

export const Programmatic: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("dialog", "programmatic") },
      source: { code: ProgrammaticSource },
    },
  },
  render: ProgrammaticExample,
};
