import type { Meta, StoryObj } from "@storybook/tanstack-react";

const meta = {
  title: "Utilities/Scroll Fade",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "CSS utilities for scroll-aware edge fades. Add the class to the element that owns overflow. The mask adapts to any background and horizontal logical edges mirror in RTL.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const rows = Array.from({ length: 14 }, (_, index) => index + 1);

export const Vertical: Story = {
  render: () => (
    <div className="w-72 overflow-hidden rounded-lg border bg-background">
      <div className="scroll-fade h-56 overflow-y-auto px-4">
        {rows.map((row) => (
          <div key={row} className="border-b py-4 text-sm">
            Scrollable row {row}
          </div>
        ))}
      </div>
    </div>
  ),
};

export const HorizontalRTL: Story = {
  render: () => (
    <div dir="rtl" className="scroll-fade-x flex w-96 gap-3 overflow-x-auto p-4">
      {rows.map((row) => (
        <div
          key={row}
          className="grid h-36 min-w-32 shrink-0 place-items-center rounded-lg border bg-card text-sm"
        >
          Card {row}
        </div>
      ))}
    </div>
  ),
};

export const SingleEdgeAndCustomDepth: Story = {
  render: () => (
    <div className="w-72 overflow-hidden rounded-lg border bg-background">
      <div className="scroll-fade-b-8 h-56 overflow-y-auto px-4">
        {rows.map((row) => (
          <div key={row} className="border-b py-4 text-sm">
            Bottom edge only · row {row}
          </div>
        ))}
      </div>
    </div>
  ),
};
