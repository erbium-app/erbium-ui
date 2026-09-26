import { BubbleContent } from "@erbium/ui/components/bubble";
import { BubbleVariantsDemo } from "../examples/upstream/bubble-variants";
import { BubbleLinkButtonDemo } from "../examples/upstream/bubble-link-button";
import { BubbleReactionsDemo } from "../examples/upstream/bubble-reactions";
import { BubbleAlignmentDemo } from "../examples/upstream/bubble-alignment";
import { BubbleGroupDemo } from "../examples/upstream/bubble-group-demo";
import { BubbleCollapsible } from "../examples/upstream/bubble-collapsible";
import { BubbleTooltipDemo } from "../examples/upstream/bubble-tooltip";
import { BubblePopoverDemo } from "../examples/upstream/bubble-popover";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Bubble } from "@erbium/ui/components/bubble";
import Demo from "../examples/bubble-demo";

const meta = {
  title: "UI/Bubble",
  component: Bubble,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays conversational content in a message bubble. Supports variants, alignment, grouping, reactions, and collapsible content.\n\n**Import:** `@erbium/ui/components/bubble`  \n\n**shadcn/ui page:** [Bubble](https://ui.shadcn.com/docs/components/base/bubble)\n\n### Usage\n\n```tsx\nimport { Bubble, BubbleContent, BubbleReactions } from "@erbium/ui/components/bubble"\n```\n\n```tsx\n<Bubble>\n  <BubbleContent>\n    I checked the registry output and removed the stale route.\n  </BubbleContent>\n  <BubbleReactions>\n    <span>👍</span>\n  </BubbleReactions>\n</Bubble>\n```\n\n### Composition\n\nUse the following composition to build a bubble:\n\nUse `BubbleGroup` to group consecutive bubbles from the same sender:\n\n```text\nBubble\n├── BubbleContent\n└── BubbleReactions\n```\n\n```text\nBubbleGroup\n├── Bubble\n│   └── BubbleContent\n└── Bubble\n    └── BubbleContent\n```\n\n### Features\n\n- Seven visual variants, from a strong primary bubble to unframed ghost content\n\n- Start and end alignment for sender and receiver bubbles\n\n- Reactions that anchor to the bubble edge with configurable side and alignment\n\n- Bubbles size to their content, up to 80% of the container width\n\n- Polymorphic content via `render` for link and button bubbles\n\n- Customizable styling through the `className` prop on every part\n\n### Accessibility\n\n`Bubble` renders the presentational message surface. Keep conversation-level semantics on the surrounding container and follow the guidelines below.\n\nReactions render as a row of emoji. A screen reader reads each glyph with no context, and counters like `+8` are announced as "plus eight". Group the row as a single image with a descriptive `aria-label` so it announces once. `role="img"` also hides the individual emoji from assistive tech, so no `aria-hidden` is needed.\n\nWhen reactions are interactive, render buttons instead and give icon-only buttons an `aria-label`.\n\nWhen a bubble is clickable, render it as a real `<button>` or `<a>` with the `render` prop so it is focusable and exposes the correct role. `BubbleContent` ships a visible focus ring for interactive elements, and the accessible name comes from the bubble text. No extra label is needed.\n\nBubble variants signal role and tone with color. Pair them with text, alignment, or icons so meaning is not conveyed by color alone. For a `destructive` bubble, keep the error context in the message text rather than relying on the color treatment.\n\n```tsx\n<BubbleReactions role="img" aria-label="Reactions: thumbs up, fire, and 8 more">\n  <span>👍</span>\n  <span>🔥</span>\n  <span>+8</span>\n</BubbleReactions>\n```\n\n```tsx\n<BubbleReactions>\n  <Button aria-label="Thumbs up" variant="secondary" size="icon-xs">\n    <ThumbsUpIcon />\n  </Button>\n</BubbleReactions>\n```\n\n```tsx\n<Bubble variant="muted" align="end">\n  <BubbleContent render={<button type="button" onClick={onReply} />}>\n    I forgot my password\n  </BubbleContent>\n</Bubble>\n```',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof Bubble> = {
  args: { variant: "default", align: "start", className: "" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "muted", "tinted", "outline", "ghost", "destructive"],
    },
    align: { control: "select", options: ["start", "end"] },
  },
  render: (args) => (
    <div className="flex w-80 flex-col">
      <Bubble {...args}>
        <BubbleContent>How can I help you?</BubbleContent>
      </Bubble>
    </div>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Bubble, BubbleContent, BubbleGroup } from "@erbium/ui/components/bubble";\nexport default function Demo() {\n  return (\n    <BubbleGroup>\n      <Bubble>\n        <BubbleContent>Hello! How can I help?</BubbleContent>\n      </Bubble>\n      <Bubble>\n        <BubbleContent>Show me the latest update.</BubbleContent>\n      </Bubble>\n    </BubbleGroup>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Alignment: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `align` on `Bubble` to align the bubble to the start or end of the conversation.\n\n| align   | Description                                        |\n\n| ------- | -------------------------------------------------- |\n\n| `start` | Align the bubble to the start of the conversation. |\n\n| `end`   | Align the bubble to the end of the conversation.   |\n\n**Note:** When building chat interfaces, you probably want to use alignment on the `Message` component itself, not the `Bubble` component. You can use the `role` prop on the `Message` component to automatically align the bubble to the start or end of the conversation.",
      },
      source: {
        code: 'import { Bubble, BubbleContent } from "@erbium/ui/components/bubble";\n\nexport function BubbleAlignmentDemo() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-8 py-12">\n      <Bubble variant="muted">\n        <BubbleContent>\n          This bubble is aligned to the start. This is the default alignment.\n        </BubbleContent>\n      </Bubble>\n      <Bubble align="end">\n        <BubbleContent>\n          This bubble is aligned to the end. Use this for user messages.\n        </BubbleContent>\n      </Bubble>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <BubbleAlignmentDemo />,
};
export const GroupDemo: Story = {
  name: "Bubble Group",
  parameters: {
    docs: {
      description: {
        story:
          "Use `BubbleGroup` to group consecutive bubbles from the same sender. Note the `align` prop should be set on the `Bubble` component itself, not the `BubbleGroup` component.\n\n```text\nBubbleGroup\n├── Bubble\n│   └── BubbleContent\n└── Bubble\n    └── BubbleContent\n```",
      },
      source: {
        code: 'import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@erbium/ui/components/bubble";\n\nexport function BubbleGroupDemo() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-8 py-12">\n      <Bubble variant="muted">\n        <BubbleContent>Can you tell me what&apos;s the issue?</BubbleContent>\n      </Bubble>\n      <BubbleGroup>\n        <Bubble align="end">\n          <BubbleContent>You tell me!</BubbleContent>\n        </Bubble>\n        <Bubble align="end">\n          <BubbleContent>It worked yesterday. You broke it!</BubbleContent>\n        </Bubble>\n        <Bubble align="end">\n          <BubbleContent>Find the bug and fix it.</BubbleContent>\n          <BubbleReactions aria-label="Reactions: eyes" align="start">\n            <span>👀</span>\n          </BubbleReactions>\n        </Bubble>\n      </BubbleGroup>\n      <Bubble variant="muted">\n        <BubbleContent>\n          Want me to diff yesterday&apos;s you against today&apos;s you? It&apos;s a bit\n          embarrassing.\n        </BubbleContent>\n      </Bubble>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <BubbleGroupDemo />,
};
export const Collapsible: Story = {
  name: "Show More / Collapsible",
  parameters: {
    docs: {
      description: {
        story:
          "Long bubble content can be composed with [`Collapsible`](https://ui.shadcn.com/docs/components/collapsible) to allow for a show more or show less interaction. Use the `CollapsibleTrigger` component to trigger the collapsible content.",
      },
      source: {
        code: 'import * as React from "react";\nimport { ChevronDownIcon } from "lucide-react";\n\nimport { Bubble, BubbleContent } from "@erbium/ui/components/bubble";\nimport { Button } from "@erbium/ui/components/button";\nimport { Collapsible, CollapsibleTrigger } from "@erbium/ui/components/collapsible";\n\nconst text = `The accessibility review found two focus states that were visually too subtle in dark mode.\n\nI checked the dialog, menu, and drawer paths because each one renders focusable controls inside a layered surface.\n\nThe dialog and drawer are fine. The menu needs the hover and focus tokens split so keyboard focus stays visible when the pointer is not involved.\n\nI also recommend keeping the change in the style file instead of the primitive so the other themes can choose their own focus treatment later.`;\n\nconst previewLength = 180;\n\nexport function BubbleCollapsible() {\n  const [open, setOpen] = React.useState(false);\n  const isLong = text.length > previewLength;\n  const preview = `${text.slice(0, previewLength)}...`;\n\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-8 py-12">\n      <Bubble variant="muted">\n        <BubbleContent>How can I help you today?</BubbleContent>\n      </Bubble>\n\n      <Bubble variant="muted" align="end">\n        <BubbleContent className="whitespace-pre-line">\n          <Collapsible open={open} onOpenChange={setOpen}>\n            <div>{open || !isLong ? text : preview}</div>\n            {isLong ? (\n              <CollapsibleTrigger\n                render={<Button variant="link" className="gap-1 p-0 text-muted-foreground" />}\n              >\n                {open ? "Show less" : "Show more"}\n                <ChevronDownIcon\n                  data-icon="inline-end"\n                  className="group-data-panel-open/button:rotate-180"\n                />\n              </CollapsibleTrigger>\n            ) : null}\n          </Collapsible>\n        </BubbleContent>\n      </Bubble>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <BubbleCollapsible />,
};
export const Tooltip: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Wrap a bubble in a [`Tooltip`](https://ui.shadcn.com/docs/components/tooltip) to reveal metadata on hover, such as when a message was read.",
      },
      source: {
        code: 'import { CheckIcon } from "lucide-react";\n\nimport { Bubble, BubbleContent, BubbleReactions } from "@erbium/ui/components/bubble";\nimport { Button } from "@erbium/ui/components/button";\nimport { Tooltip, TooltipContent, TooltipTrigger } from "@erbium/ui/components/tooltip";\n\nexport function BubbleTooltipDemo() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-4 py-12">\n      <Bubble variant="secondary">\n        <BubbleContent>Did you remove the stale route?</BubbleContent>\n      </Bubble>\n      <Bubble align="end">\n        <BubbleContent>Yes, removed it from the registry.</BubbleContent>\n        <BubbleReactions>\n          <Tooltip>\n            <TooltipTrigger render={<Button variant="ghost" size="icon-xs" />}>\n              <CheckIcon />\n            </TooltipTrigger>\n            <TooltipContent>Read on Jan 5, 2026 at 4:32 PM</TooltipContent>\n          </Tooltip>\n        </BubbleReactions>\n      </Bubble>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <BubbleTooltipDemo />,
};
export const Popover: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Pair a bubble with a [`Popover`](https://ui.shadcn.com/docs/components/popover) to surface more information on demand, such as the full error message for a failed action.",
      },
      source: {
        code: 'import { InfoIcon } from "lucide-react";\n\nimport { Bubble, BubbleContent, BubbleReactions } from "@erbium/ui/components/bubble";\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  Popover,\n  PopoverContent,\n  PopoverDescription,\n  PopoverHeader,\n  PopoverTitle,\n  PopoverTrigger,\n} from "@erbium/ui/components/popover";\n\nexport function BubblePopoverDemo() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-4 py-12">\n      <Bubble align="end">\n        <BubbleContent>Run the build script.</BubbleContent>\n      </Bubble>\n      <Bubble variant="destructive">\n        <BubbleContent>Failed to run the command.</BubbleContent>\n        <BubbleReactions>\n          <Popover>\n            <PopoverTrigger\n              render={\n                <Button\n                  variant="ghost"\n                  size="icon-xs"\n                  aria-label="Show error details"\n                  className="aria-expanded:text-destructive"\n                />\n              }\n            >\n              <InfoIcon />\n            </PopoverTrigger>\n            <PopoverContent>\n              <PopoverHeader>\n                <PopoverTitle className="text-sm">Command failed with exit code 1</PopoverTitle>\n                <PopoverDescription className="text-sm">\n                  ENOENT: no such file or directory, open pnpm-lock.yaml\n                </PopoverDescription>\n              </PopoverHeader>\n            </PopoverContent>\n          </Popover>\n        </BubbleReactions>\n      </Bubble>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <BubblePopoverDemo />,
};

export const LinkButton: Story = {
  name: "Links and Buttons",
  parameters: {
    docs: {
      description: {
        story:
          'You can turn a bubble into a link or button by using the `render` prop on `BubbleContent`.\n\n```tsx\nimport { Bubble, BubbleContent } from "@erbium/ui/components/bubble"\n\nexport function BubbleLinkDemo() {\n  return (\n    <Bubble variant="muted">\n      <BubbleContent render={<button />}>Click here</BubbleContent>\n    </Bubble>\n  )\n}\n```',
      },
      source: {
        code: 'import { toast } from "@erbium/ui/components/toast";\n\nimport { Bubble, BubbleContent, BubbleGroup } from "@erbium/ui/components/bubble";\n\nexport function BubbleLinkButtonDemo() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-8 py-12">\n      <Bubble variant="muted">\n        <BubbleContent>How can I help you today?</BubbleContent>\n      </Bubble>\n      <BubbleGroup>\n        <Bubble variant="tinted" align="end">\n          <BubbleContent render={<button onClick={() => toast.add({ title: "You clicked forgot password" })} />}>\n            I forgot my password\n          </BubbleContent>\n        </Bubble>\n        <Bubble variant="tinted" align="end">\n          <BubbleContent\n            render={<button onClick={() => toast.add({ title: "You clicked help with subscription" })} />}\n          >\n            I need help with my subscription\n          </BubbleContent>\n        </Bubble>\n        <Bubble variant="tinted" align="end">\n          <BubbleContent\n            render={\n              <button onClick={() => toast.add({ title: "You clicked something else. Talk to a human." })} />\n            }\n          >\n            Something else. Talk to a human.\n          </BubbleContent>\n        </Bubble>\n      </BubbleGroup>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <BubbleLinkButtonDemo />,
};
export const Reactions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use `BubbleReactions` for bubble reactions. You can use it to display reactions or quick action buttons. Use `side` and `align` to position the row — `side="top"` anchors it to the upper edge. Reactions overlap the bubble edge, so leave vertical space between rows — the examples below use a larger `gap` for this reason.',
      },
      source: {
        code: 'import { toast } from "@erbium/ui/components/toast";\n\nimport { Bubble, BubbleContent, BubbleReactions } from "@erbium/ui/components/bubble";\nimport { Button } from "@erbium/ui/components/button";\n\nexport function BubbleReactionsDemo() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-12 py-12">\n      <Bubble variant="muted" align="end">\n        <BubbleContent>I don&apos;t need tests, I know my code works.</BubbleContent>\n        <BubbleReactions align="start" role="img" aria-label="Reactions: thumbs up, surprised">\n          <span>👍</span>\n          <span>😮</span>\n        </BubbleReactions>\n      </Bubble>\n      <Bubble variant="muted">\n        <BubbleContent>\n          Bold. Fine I&apos;ll add some tests. I&apos;ll let you know when they&apos;re done.\n        </BubbleContent>\n        <BubbleReactions role="img" aria-label="Reactions: eyes, rocket, and 2 more">\n          <span>👀</span>\n          <span>🚀</span>\n          <span>+2</span>\n        </BubbleReactions>\n      </Bubble>\n      <Bubble variant="default" align="end">\n        <BubbleContent>Tests passed on the first try. All 142 of them. Looking good!</BubbleContent>\n        <BubbleReactions\n          side="top"\n          align="start"\n          role="img"\n          aria-label="Reactions: party popper, clapping hands"\n        >\n          <span>🎉</span>\n          <span>👏</span>\n        </BubbleReactions>\n      </Bubble>\n      <Bubble variant="destructive">\n        <BubbleContent>Are you sure I can run this command?</BubbleContent>\n        <BubbleReactions>\n          <Button\n            variant="ghost"\n            size="xs"\n            onClick={() => toast.add({ type: "success", title: "You clicked yes, running command..." })}\n          >\n            Yes, run it\n          </Button>\n        </BubbleReactions>\n      </Bubble>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <BubbleReactionsDemo />,
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `variant` to change the visual treatment of the bubble.\n\n| Variant       | Description                                            |\n\n| ------------- | ------------------------------------------------------ |\n\n| `default`     | A strong primary bubble, usually for the current user. |\n\n| `secondary`   | The standard neutral bubble for conversation content.  |\n\n| `muted`       | A lower-emphasis bubble for quiet supporting content.  |\n\n| `tinted`      | A subtle primary-tinted bubble.                        |\n\n| `outline`     | A bordered bubble for secondary or rich content.       |\n\n| `ghost`       | Unframed content for assistant text or rich content.   |\n\n| `destructive` | A destructive bubble for error or failed actions.      |\n\nA bubble sizes to its content, up to 80% of the container width. The `ghost` variant removes the max-width so assistant text and rich content can span the full row.",
      },
      source: {
        code: 'import { Bubble, BubbleContent, BubbleReactions } from "@erbium/ui/components/bubble";\n\nexport function BubbleVariantsDemo() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-12 py-12">\n      <Bubble>\n        <BubbleContent>This is the default primary bubble.</BubbleContent>\n      </Bubble>\n      <Bubble variant="secondary" align="end">\n        <BubbleContent>This is the secondary variant.</BubbleContent>\n      </Bubble>\n      <Bubble variant="muted">\n        <BubbleContent>\n          This one is muted. It uses a lower emphasis color for the chat bubble.\n        </BubbleContent>\n        <BubbleReactions role="img" aria-label="Reaction: thumbs up">\n          <span>👍</span>\n        </BubbleReactions>\n      </Bubble>\n      <Bubble variant="tinted" align="end">\n        <BubbleContent>\n          This one is tinted. The tint is a softer color derived from the primary color.\n        </BubbleContent>\n      </Bubble>\n      <Bubble variant="outline">\n        <BubbleContent>We can also use an outlined variant.</BubbleContent>\n      </Bubble>\n      <Bubble variant="destructive" align="end">\n        <BubbleContent>Or a destructive variant with a reaction.</BubbleContent>\n        <BubbleReactions role="img" aria-label="Reaction: fire">\n          <span>🔥</span>\n        </BubbleReactions>\n      </Bubble>\n      <Bubble variant="ghost">\n        <BubbleContent>\n          <p>\n            Ghost bubbles can contain long assistant responses, formatted text, and code examples.\n          </p>\n        </BubbleContent>\n      </Bubble>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => <BubbleVariantsDemo />,
};
