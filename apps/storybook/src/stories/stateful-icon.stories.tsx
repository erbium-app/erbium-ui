import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@erbium/ui/components/collapsible";
import {
  ExpandableChevron as ExpandableChevronIcon,
  RotatingChevron as RotatingChevronIcon,
  SidebarToggleIcon as SidebarToggleIconGraphic,
} from "@erbium/ui/components/stateful-icon";
import { useState } from "react";
import StatefulIconDemo from "../examples/stateful-icon-demo";

const meta = {
  title: "UI/Stateful Icon",
  parameters: {
    docs: {
      description: {
        component:
          "StatefulIcon animates between caller-provided content states. RotatingChevron, ExpandableChevron, and SidebarToggleIcon indicate open state. Import from `@erbium/ui/components/stateful-icon`.",
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

function ExpandableChevronExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible className="w-72" open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center rounded-lg border px-3 py-2 text-start">
        Project details
        <ExpandableChevronIcon className="ms-auto" isOpen={isOpen} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 py-2 text-sm text-muted-foreground">
        The two chevrons exchange positions as this section opens and closes.
      </CollapsibleContent>
    </Collapsible>
  );
}

export const ExpandableChevron: Story = {
  render: () => <ExpandableChevronExample />,
};

function SidebarToggleIconExample({ side }: { side: "left" | "right" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      aria-expanded={isOpen}
      aria-label={`${isOpen ? "Close" : "Open"} ${side} sidebar`}
      className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
      onClick={() => setIsOpen((open) => !open)}
      type="button"
    >
      <SidebarToggleIconGraphic isOpen={isOpen} side={side} />
      {side === "left" ? "Left" : "Right"} sidebar
    </button>
  );
}

export const SidebarToggleIcon: Story = {
  render: () => (
    <div className="flex gap-3">
      <SidebarToggleIconExample side="left" />
      <SidebarToggleIconExample side="right" />
    </div>
  ),
};
