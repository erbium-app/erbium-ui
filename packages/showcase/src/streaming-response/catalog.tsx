import { StreamingResponse } from "@erbium/ui/blocks/streaming-response";
import type { Meta, StoryObj } from "../types";
import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";
import OverviewExample from "./variants/overview";
import OverviewSource from "./variants/overview.tsx?raw";
import MarkdownExample from "./variants/markdown";
import MarkdownSource from "./variants/markdown.tsx?raw";
import ActionsExample from "./variants/actions";
import ActionsSource from "./variants/actions.tsx?raw";
import StatesExample from "./variants/states";
import StatesSource from "./variants/states.tsx?raw";
import CustomUiExample from "./variants/custom-ui";
import CustomUiSource from "./variants/custom-ui.tsx?raw";

const name = "streaming-response";

const meta = {
  component: StreamingResponse,
  parameters: {
    docs: { description: { component: componentDocumentation(name) } },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StreamingResponse>;

export default meta;

type Story = StoryObj;

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(name, "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Markdown: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(name, "markdown") },
      source: { code: MarkdownSource },
    },
  },
  render: MarkdownExample,
};

export const Actions: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(name, "actions") },
      source: { code: ActionsSource },
    },
  },
  render: ActionsExample,
};

export const States: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(name, "states") },
      source: { code: StatesSource },
    },
  },
  render: StatesExample,
};

export const CustomUi: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation(name, "custom-ui") },
      source: { code: CustomUiSource },
    },
  },
  render: CustomUiExample,
};
