import type { Meta, StoryObj } from "../types";

import { Separator } from "@erbium/ui/components/separator";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import VerticalExample from "./variants/vertical";

import VerticalSource from "./variants/vertical.tsx?raw";

import LabeledExample from "./variants/labeled";

import LabeledSource from "./variants/labeled.tsx?raw";

import FullWidthExample from "./variants/full-width";

import FullWidthSource from "./variants/full-width.tsx?raw";

import OnSurfacesExample from "./variants/on-surfaces";

import OnSurfacesSource from "./variants/on-surfaces.tsx?raw";

import MenuExample from "./variants/menu";

import MenuSource from "./variants/menu.tsx?raw";

import ListExample from "./variants/list";

import ListSource from "./variants/list.tsx?raw";

import MarginSizingExample from "./variants/margin-sizing";

import MarginSizingSource from "./variants/margin-sizing.tsx?raw";

const meta = {
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("separator"),
      },
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Separator> = {
  args: { orientation: "horizontal", className: "" },
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
    variant: { control: "select", options: [undefined, "full", "inset"] },
  },
  parameters: {
    docs: {
      description: { story: variantDocumentation("separator", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("separator", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Vertical: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("separator", "vertical") },
      source: { code: VerticalSource },
    },
  },
  render: VerticalExample,
};

export const Labeled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("separator", "labeled") },
      source: { code: LabeledSource },
    },
  },
  render: LabeledExample,
};

export const FullWidth: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("separator", "full-width") },
      source: { code: FullWidthSource },
    },
  },
  render: FullWidthExample,
};

export const OnSurfaces: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("separator", "on-surfaces") },
      source: { code: OnSurfacesSource },
    },
  },
  render: OnSurfacesExample,
};

export const Menu: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("separator", "menu") },
      source: { code: MenuSource },
    },
  },
  render: MenuExample,
};

export const List: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("separator", "list") },
      source: { code: ListSource },
    },
  },
  render: ListExample,
};

export const MarginSizing: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("separator", "margin-sizing") },
      source: { code: MarginSizingSource },
    },
  },
  render: MarginSizingExample,
};
