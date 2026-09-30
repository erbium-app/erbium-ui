import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Editable } from "@erbium/ui/components/editable";
import Demo from "../examples/editable-demo";

const meta = {
  title: "UI/Editable",
  component: Editable,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A single-line inline editor. The preview stays in the layout while the input overlays it, keeping the text position and neighboring content stable during editing. Enter or blur saves; Escape cancels.",
      },
    },
  },
} satisfies Meta<typeof Editable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RenameTab: Story = {
  render: () => <Demo />,
};
