import type { Meta, StoryObj } from "../types";
import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";
import { Skeleton } from "@erbium/ui/components/skeleton";
import { latencyArgType } from "../loading";
import PlaygroundExample, { defaultProps as PlaygroundDefaults } from "./variants/playground";
import PlaygroundSource from "./variants/playground.tsx?raw";
import OverviewExample from "./variants/overview";
import OverviewSource from "./variants/overview.tsx?raw";
import CardExample from "./variants/card";
import CardSource from "./examples/skeleton-card.tsx?raw";
import TextExample from "./variants/text";
import TextSource from "./examples/skeleton-text.tsx?raw";
import AvatarExample from "./variants/avatar";
import AvatarSource from "./variants/avatar.tsx?raw";
import FormExample from "./variants/form";
import FormSource from "./examples/skeleton-form.tsx?raw";
import TableExample from "./variants/table";
import TableSource from "./examples/skeleton-table.tsx?raw";
import RefetchExample from "./variants/refetch";
import RefetchSource from "./examples/skeleton-refetch.tsx?raw";
import SuspenseExample from "./variants/suspense";
import SuspenseSource from "./examples/skeleton-suspense.tsx?raw";
import StatesExample from "./variants/states";
import StatesSource from "./examples/skeleton-states.tsx?raw";
import SectionsExample from "./variants/sections";
import SectionsSource from "./examples/skeleton-sections.tsx?raw";
import BoxExample from "./variants/box";
import BoxSource from "./examples/skeleton-box.tsx?raw";
import RevealsExample from "./variants/reveals";
import RevealsSource from "./variants/reveals.tsx?raw";

const meta = {
  component: Skeleton,
  parameters: {
    docs: {
      description: {
        component: componentDocumentation("skeleton"),
      },
    },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj;

export const Playground: StoryObj<typeof PlaygroundExample> = {
  argTypes: {
    ...latencyArgType,
    reveal: { control: { type: "select" }, options: ["smart", "together", "sequence", "sweep"] },
  },
  args: PlaygroundDefaults,
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

export const Card: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("skeleton", "card") },
      source: { code: CardSource },
    },
  },
  render: CardExample,
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

export const Avatar: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("skeleton", "avatar") },
      source: { code: AvatarSource },
    },
  },
  render: AvatarExample,
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

export const Refetch: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("skeleton", "refetch") },
      source: { code: RefetchSource },
    },
  },
  render: RefetchExample,
};

export const Suspense: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("skeleton", "suspense") },
      source: { code: SuspenseSource },
    },
  },
  render: SuspenseExample,
};

export const States: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("skeleton", "states") },
      source: { code: StatesSource },
    },
  },
  render: StatesExample,
};

export const Sections: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("skeleton", "sections") },
      source: { code: SectionsSource },
    },
  },
  render: SectionsExample,
};

export const Box: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("skeleton", "box") },
      source: { code: BoxSource },
    },
  },
  render: BoxExample,
};

export const Reveals: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("skeleton", "reveals") },
      source: { code: RevealsSource },
    },
  },
  render: RevealsExample,
};
