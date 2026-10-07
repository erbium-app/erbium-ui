import { CodeBlock } from "@erbium/ui/blocks/code-block";
import type { Meta, StoryObj } from "../types";
import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";
import OverviewExample from "./variants/overview";
import OverviewSource from "./variants/overview.tsx?raw";
import CommandsExample from "./variants/commands";
import CommandsSource from "./variants/commands.tsx?raw";
import FilesExample from "./variants/files";
import FilesSource from "./variants/files.tsx?raw";
import ControlledExample from "./variants/controlled";
import ControlledSource from "./variants/controlled.tsx?raw";
import CompositionExample from "./variants/composition";
import CompositionSource from "./variants/composition.tsx?raw";
import OverflowExample from "./variants/overflow";
import OverflowSource from "./variants/overflow.tsx?raw";
import StatesExample from "./variants/states";
import StatesSource from "./variants/states.tsx?raw";
import ChangingSourceExample from "./variants/changing-source";
import ChangingSourceSource from "./variants/changing-source.tsx?raw";
import RtlExample from "./variants/rtl";
import RtlSource from "./variants/rtl.tsx?raw";
const meta = {
  component: CodeBlock,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { description: { component: componentDocumentation("code-block") } },
  },
} satisfies Meta<typeof CodeBlock>;
export default meta;
type Story = StoryObj;

export const Overview: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("code-block", "overview") },
      source: { code: OverviewSource },
    },
  },
  render: OverviewExample,
};

export const Commands: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("code-block", "commands") },
      source: { code: CommandsSource },
    },
  },
  render: CommandsExample,
};

export const Files: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("code-block", "files") },
      source: { code: FilesSource },
    },
  },
  render: FilesExample,
};

export const Controlled: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("code-block", "controlled") },
      source: { code: ControlledSource },
    },
  },
  render: ControlledExample,
};

export const Composition: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("code-block", "composition") },
      source: { code: CompositionSource },
    },
  },
  render: CompositionExample,
};

export const Overflow: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("code-block", "overflow") },
      source: { code: OverflowSource },
    },
  },
  render: OverflowExample,
};

export const States: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("code-block", "states") },
      source: { code: StatesSource },
    },
  },
  render: StatesExample,
};

export const ChangingSource: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("code-block", "changing-source") },
      source: { code: ChangingSourceSource },
    },
  },
  render: ChangingSourceExample,
};

export const Rtl: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("code-block", "rtl") },
      source: { code: RtlSource },
    },
  },
  render: RtlExample,
};
