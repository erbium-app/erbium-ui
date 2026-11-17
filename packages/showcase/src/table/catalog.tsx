import type { PlaygroundArgs } from "./helpers";
import { Table } from "@erbium/ui/components/table";

import type { Meta, StoryObj } from "../types";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./examples/table-demo.tsx?raw";

import FooterExample from "./variants/footer";

import FooterSource from "./examples/table-footer.tsx?raw";

import ActionsExample from "./variants/actions";

import ActionsSource from "./examples/table-actions.tsx?raw";

import RowSelectionExample from "./variants/row-selection";

import RowSelectionSource from "./variants/row-selection.tsx?raw";

import RTLExample from "./variants/rtl";

import RTLSource from "./examples/table-rtl.tsx?raw";

const meta = {
  component: Table,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("table"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<PlaygroundArgs> = {
  argTypes: {
    caption: { control: "text" },
    rows: { control: { max: 10, min: 1, type: "number" } },
  },
  args: PlaygroundDefaults,
  parameters: {
    docs: {
      description: { story: variantDocumentation("table", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("table", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Footer: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("table", "footer") },
      source: { code: FooterSource },
    },
  },
  render: FooterExample,
};

export const Actions: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("table", "actions") },
      source: { code: ActionsSource },
    },
  },
  render: ActionsExample,
};

export const RowSelection: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("table", "row-selection") },
      source: { code: RowSelectionSource },
    },
  },
  render: RowSelectionExample,
};

export const RTL: Story = {
  name: "RTL",
  parameters: {
    docs: {
      description: { story: variantDocumentation("table", "rtl") },
      source: { code: RTLSource },
    },
  },
  render: RTLExample,
};
