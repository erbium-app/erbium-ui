import type { Meta, StoryObj } from "../types";
import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";
import OverviewExample from "./variants/overview";
import OverviewSource from "./variants/overview.tsx?raw";
import FacetedExample from "./variants/faceted";
import FacetedSource from "./variants/faceted.tsx?raw";
import ListExample from "./variants/list";
import ListSource from "./variants/list.tsx?raw";
import RouterExample from "./variants/router";
import RouterSource from "./variants/router.tsx?raw";

const meta = {
  parameters: {
    docs: { description: { component: componentDocumentation("filters") } },
    layout: "centered",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("filters", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Faceted: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("filters", "faceted") },
      source: { code: FacetedSource },
    },
  },
  render: FacetedExample,
};

export const List: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("filters", "list") },
      source: { code: ListSource },
    },
  },
  render: ListExample,
};

export const Router: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("filters", "router") },
      source: { code: RouterSource },
    },
  },
  render: RouterExample,
};
