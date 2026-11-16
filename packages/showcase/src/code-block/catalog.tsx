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
import LineNumbersExample from "./variants/line-numbers";
import LineNumbersSource from "./variants/line-numbers.tsx?raw";
import HighlightedLinesExample from "./variants/highlighted-lines";
import HighlightedLinesSource from "./variants/highlighted-lines.tsx?raw";
import StatesExample from "./variants/states";
import StatesSource from "./variants/states.tsx?raw";
import ChangingSourceExample from "./variants/changing-source";
import ChangingSourceSource from "./variants/changing-source.tsx?raw";
import StreamingExample from "./variants/streaming";
import StreamingSource from "./variants/streaming.tsx?raw";
import LanguagesExample from "./variants/languages";
import LanguagesSource from "./variants/languages.tsx?raw";

const meta = {
  component: CodeBlock,
  parameters: {
    docs: { description: { component: componentDocumentation("code-block") } },
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CodeBlock>;

export default meta;

type Story = StoryObj;

export const Languages: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("code-block", "languages") },
      source: { code: LanguagesSource },
    },
  },
  render: LanguagesExample,
};

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

export const LineNumbers: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("code-block", "line-numbers") },
      source: { code: LineNumbersSource },
    },
  },
  render: LineNumbersExample,
};

export const HighlightedLines: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("code-block", "highlighted-lines") },
      source: { code: HighlightedLinesSource },
    },
  },
  render: HighlightedLinesExample,
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

export const Streaming: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("code-block", "streaming") },
      source: { code: StreamingSource },
    },
  },
  render: StreamingExample,
};
