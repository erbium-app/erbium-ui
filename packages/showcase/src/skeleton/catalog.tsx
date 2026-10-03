import type { Meta, StoryObj } from "../types";

import { Skeleton } from "@erbium/ui/components/skeleton";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import PlaygroundExample from "./variants/playground";

import PlaygroundSource from "./variants/playground.tsx?raw";

import OverviewExample from "./variants/overview";

import OverviewSource from "./variants/overview.tsx?raw";

import LoadingCardExample from "./variants/loading-card";

import LoadingCardSource from "./variants/loading-card.tsx?raw";

import CardExample from "./variants/card";

import CardSource from "./variants/card.tsx?raw";

import StaggeredExample from "./variants/staggered";

import StaggeredSource from "./variants/staggered.tsx?raw";

import AvatarExample from "./variants/avatar";

import AvatarSource from "./variants/avatar.tsx?raw";

import TextExample from "./variants/text";

import TextSource from "./variants/text.tsx?raw";

import FormExample from "./variants/form";

import FormSource from "./variants/form.tsx?raw";

import TableExample from "./variants/table";

import TableSource from "./variants/table.tsx?raw";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("skeleton"),
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof Skeleton> = {
  args: { className: "h-8 w-48" },
  argTypes: {},
  parameters: {
    docs: {
      description: { story: variantDocumentation("skeleton", "playground") },
      source: { code: PlaygroundSource },
    },
  },
  render: PlaygroundExample,
};

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("skeleton", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const LoadingCard: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("skeleton", "loading-card") },
      source: { code: LoadingCardSource },
    },
  },
  render: LoadingCardExample,
};

export const Card: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("skeleton", "card") },
      source: { code: CardSource },
    },
  },
  render: CardExample,
};

export const Staggered: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("skeleton", "staggered") },
      source: { code: StaggeredSource },
    },
  },
  render: StaggeredExample,
};

export const Avatar: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("skeleton", "avatar") },
      source: { code: AvatarSource },
    },
  },
  render: AvatarExample,
};

export const Text: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("skeleton", "text") },
      source: { code: TextSource },
    },
  },
  render: TextExample,
};

export const Form: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("skeleton", "form") },
      source: { code: FormSource },
    },
  },
  render: FormExample,
};

export const Table: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("skeleton", "table") },
      source: { code: TableSource },
    },
  },
  render: TableExample,
};
