import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@erbium/ui/components/collapsible";
import { RotatingChevron as RotatingChevronIcon } from "@erbium/ui/components/stateful-icon";
import StatefulIconDemo from "../examples/stateful-icon-demo";

const meta = {
  title: "UI/Stateful Icon",
  parameters: {
    docs: {
      description: {
        component:
          "Animates between caller-provided icon or content states. Import from `@erbium/ui/components/stateful-icon`.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CopyFeedback: Story = {
  render: () => <StatefulIconDemo />,
};

export const RotatingChevron: Story = {
  render: () => (
    <Collapsible className="w-72">
      <CollapsibleTrigger className="group flex w-full items-center rounded-lg border px-3 py-2 text-start">
        Project details
        <RotatingChevronIcon direction="right" className="ms-auto size-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 py-2 text-sm text-muted-foreground">
        The shared chevron follows the trigger’s open state.
      </CollapsibleContent>
    </Collapsible>
  ),
};
