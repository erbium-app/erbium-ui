import HoverCardDemo from "../examples/upstream/hover-card-demo";
import { HoverCardSides } from "../examples/upstream/hover-card-sides";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@erbium/ui/components/hover-card";
import { Button } from "@erbium/ui/components/button";
import Demo from "../examples/hover-card-demo";

const meta = {
  title: "UI/Hover Card",
  component: HoverCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'For sighted users to preview content available behind a link.\n\n**Import:** `@erbium/ui/components/hover-card`  \n\n**shadcn/ui page:** [Hover Card](https://ui.shadcn.com/docs/components/base/hover-card)\n\n### Usage\n\n```tsx\nimport {\n  HoverCard,\n  HoverCardContent,\n  HoverCardTrigger,\n} from "@erbium/ui/components/hover-card"\nimport {{ Button }} from "@erbium/ui/components/button"\n```\n\n```tsx\n<HoverCard>\n  <HoverCardTrigger render={<Button variant="link">Hover</Button>} />\n  <HoverCardContent>\n    The React Framework – created and maintained by @vercel.\n  </HoverCardContent>\n</HoverCard>\n```\n\n### Composition\n\nUse the following composition to build a `HoverCard`:\n\n```text\nHoverCard\n├── HoverCardTrigger\n└── HoverCardContent\n```',
      },
    },
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  sideOffset: number;
  defaultOpen: boolean;
}> = {
  args: { side: "bottom", align: "center", sideOffset: 4, defaultOpen: false },
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    align: { control: "select", options: ["start", "center", "end"] },
    sideOffset: { control: "number" },
    defaultOpen: { control: "boolean" },
  },
  render: (args) => (
    <HoverCard key={String(args.defaultOpen)} defaultOpen={args.defaultOpen}>
      <HoverCardTrigger render={<Button variant="link">Hover for card</Button>} />
      <HoverCardContent side={args.side} align={args.align} sideOffset={args.sideOffset}>
        Preview content
      </HoverCardContent>
    </HoverCard>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";\nimport { Button } from "@erbium/ui/components/button";\nimport { HoverCard, HoverCardContent, HoverCardTrigger } from "@erbium/ui/components/hover-card";\n\nexport default function HoverCardDemo() {\n  return (\n    <HoverCard>\n      <HoverCardTrigger render={<Button variant="link">@nextjs</Button>} />\n      <HoverCardContent className="w-80">\n        <div className="flex justify-between gap-4">\n          <Avatar>\n            <AvatarImage src="https://github.com/vercel.png" />\n            <AvatarFallback>VC</AvatarFallback>\n          </Avatar>\n          <div className="space-y-1">\n            <h4 className="text-sm font-semibold">@nextjs</h4>\n            <p className="text-sm">The React Framework – created and maintained by @vercel.</p>\n            <div className="text-xs text-muted-foreground">Joined December 2021</div>\n          </div>\n        </div>\n      </HoverCardContent>\n    </HoverCard>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: "Show supporting content when the trigger is hovered or focused." },

      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { HoverCard, HoverCardContent, HoverCardTrigger } from "@erbium/ui/components/hover-card";\n\nexport default function HoverCardDemo() {\n  return (\n    <HoverCard>\n      <HoverCardTrigger delay={10} closeDelay={100} render={<Button variant="link" />}>\n        Hover Here\n      </HoverCardTrigger>\n      <HoverCardContent className="flex w-64 flex-col gap-0.5">\n        <div className="font-semibold">@nextjs</div>\n        <div>The React Framework – created and maintained by @vercel.</div>\n        <div className="mt-1 text-xs text-muted-foreground">Joined December 2021</div>\n      </HoverCardContent>\n    </HoverCard>\n  );\n}\n',
      },
    },
  },
  render: () => <HoverCardDemo />,
};
export const Sides: Story = {
  parameters: {
    docs: {
      description: { story: "Position the hover card on different sides of its trigger." },

      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport { HoverCard, HoverCardContent, HoverCardTrigger } from "@erbium/ui/components/hover-card";\n\nconst HOVER_CARD_SIDES = ["left", "top", "bottom", "right"] as const;\n\nexport function HoverCardSides() {\n  return (\n    <div className="flex flex-wrap justify-center gap-2">\n      {HOVER_CARD_SIDES.map((side) => (\n        <HoverCard key={side}>\n          <HoverCardTrigger\n            delay={100}\n            closeDelay={100}\n            render={<Button variant="outline" className="capitalize" />}\n          >\n            {side}\n          </HoverCardTrigger>\n          <HoverCardContent side={side}>\n            <div className="flex flex-col gap-1">\n              <h4 className="font-medium">Hover Card</h4>\n              <p>This hover card appears on the {side} side of the trigger.</p>\n            </div>\n          </HoverCardContent>\n        </HoverCard>\n      ))}\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <HoverCardSides />,
};
export const TriggerDelays: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `delay` and `closeDelay` on the trigger to control when the card opens and\n\ncloses.\n\n```tsx\n<HoverCard>\n  <HoverCardTrigger delay={100} closeDelay={200} render={<Button variant="link">Hover</Button>} />\n  <HoverCardContent>Content</HoverCardContent>\n</HoverCard>\n```',
      },
    },
  },

  render: () => (
    <HoverCard>
      <HoverCardTrigger closeDelay={200} delay={100} render={<Button variant="link" />}>
        Hover to preview
      </HoverCardTrigger>
      <HoverCardContent>Opens after 100 ms and closes after 200 ms.</HoverCardContent>
    </HoverCard>
  ),
};
export const Positioning: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use the `side` and `align` props on `HoverCardContent` to control placement.\n\n```tsx\n<HoverCard>\n  <HoverCardTrigger render={<Button variant="link">Hover</Button>} />\n  <HoverCardContent side="top" align="start">\n    Content\n  </HoverCardContent>\n</HoverCard>\n```',
      },
    },
  },

  render: () => (
    <HoverCard>
      <HoverCardTrigger render={<Button variant="link" />}>Preview above</HoverCardTrigger>
      <HoverCardContent align="start" side="top">
        Aligned to the start of the trigger.
      </HoverCardContent>
    </HoverCard>
  ),
};
