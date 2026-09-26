import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { HoverCard } from "@erbium/ui/components/hover-card";
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
          'For sighted users to preview content available behind a link.\n\n**Import:** `@erbium/ui/components/hover-card`  \n\n**shadcn/ui page:** [Hover Card](https://ui.shadcn.com/docs/components/base/hover-card)\n\n### Usage\n\n```tsx\nimport {\n  HoverCard,\n  HoverCardContent,\n  HoverCardTrigger,\n} from "@erbium/ui/components/hover-card"\n```\n\n```tsx\n<HoverCard>\n  <HoverCardTrigger>Hover</HoverCardTrigger>\n  <HoverCardContent>\n    The React Framework – created and maintained by @vercel.\n  </HoverCardContent>\n</HoverCard>\n```\n\n### Composition\n\nUse the following composition to build a `HoverCard`:\n\n```text\nHoverCard\n├── HoverCardTrigger\n└── HoverCardContent\n```\n\n### Trigger Delays\n\nUse `delay` and `closeDelay` on the trigger to control when the card opens and\n\ncloses.\n\n```tsx\n<HoverCard>\n  <HoverCardTrigger delay={100} closeDelay={200}>\n    Hover\n  </HoverCardTrigger>\n  <HoverCardContent>Content</HoverCardContent>\n</HoverCard>\n```\n\n### Positioning\n\nUse the `side` and `align` props on `HoverCardContent` to control placement.\n\n```tsx\n<HoverCard>\n  <HoverCardTrigger>Hover</HoverCardTrigger>\n  <HoverCardContent side="top" align="start">\n    Content\n  </HoverCardContent>\n</HoverCard>\n```\n\n### Basic\n\nstyleName="base-nova"\n\nname="hover-card-demo"\n\npreviewClassName="h-80"\n\n/>\n\n### Sides\n\nstyleName="base-nova"\n\nname="hover-card-sides"\n\npreviewClassName="h-[22rem]"\n\n/>',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

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
