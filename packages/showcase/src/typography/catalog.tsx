import type { Meta, StoryObj } from "../types";
import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";
import TypefacesExample from "./variants/typefaces";
import TypefacesSource from "./variants/typefaces.tsx?raw";
import InterfaceExample from "./variants/interface";
import InterfaceSource from "./variants/interface.tsx?raw";
import CodeExample from "./variants/code";
import CodeSource from "./variants/code.tsx?raw";
import ReadingExample from "./variants/reading";
import ReadingSource from "./variants/reading.tsx?raw";
import MultilingualExample from "./variants/multilingual";
import MultilingualSource from "./variants/multilingual.tsx?raw";

const meta = {
  parameters: {
    docs: { description: { component: componentDocumentation("typography") } },
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Typefaces: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("typography", "typefaces") },
      source: { code: TypefacesSource },
    },
  },
  render: TypefacesExample,
};

export const Interface: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("typography", "interface") },
      source: { code: InterfaceSource },
    },
  },
  render: InterfaceExample,
};

export const Code: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("typography", "code") },
      source: { code: CodeSource },
    },
  },
  render: CodeExample,
};

export const Reading: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("typography", "reading") },
      source: { code: ReadingSource },
    },
  },
  render: ReadingExample,
};

export const Multilingual: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("typography", "multilingual") },
      source: { code: MultilingualSource },
    },
  },
  render: MultilingualExample,
};
