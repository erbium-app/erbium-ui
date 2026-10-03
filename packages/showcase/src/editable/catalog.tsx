import type { Meta, StoryObj } from "../types";

import { Editable } from "@erbium/ui/components/editable";

import { componentDocumentation, variantDocumentation } from "@erbium/content/markdown";

import RenameTabExample from "./variants/rename-tab";

import RenameTabSource from "./variants/rename-tab.tsx?raw";

const meta = {
  title: "UI/Editable",
  component: Editable,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: componentDocumentation("editable"),
      },
    },
  },
} satisfies Meta<typeof Editable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RenameTab: Story = {
  parameters: {
    docs: {
      description: { story: variantDocumentation("editable", "rename-tab") },
      source: { code: RenameTabSource },
    },
  },
  render: RenameTabExample,
};
