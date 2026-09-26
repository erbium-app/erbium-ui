import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@erbium/ui/components/drawer";
import { DrawerNested } from "../examples/upstream/drawer-nested";
import {
  CustomSizes as CustomSizesExample,
  Styling as StylingExample,
  Responsive as ResponsiveExample,
} from "../examples/drawer-variants";
import { DrawerWithSides } from "../examples/upstream/drawer-sides";
import { DrawerSwipeHandle } from "../examples/upstream/drawer-swipe-handle";
import { DrawerNonModal } from "../examples/upstream/drawer-non-modal";
import { DrawerSnapPoints } from "../examples/upstream/drawer-snap-points";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import Demo from "../examples/drawer-demo";

const meta = {
  title: "UI/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A drawer component for React.\n\n**Import:** `@erbium/ui/components/drawer`  \n\n**shadcn/ui page:** [Drawer](https://ui.shadcn.com/docs/components/base/drawer)\n\n### Usage\n\n```tsx\nimport {\n  Drawer,\n  DrawerClose,\n  DrawerContent,\n  DrawerDescription,\n  DrawerFooter,\n  DrawerHeader,\n  DrawerTitle,\n  DrawerTrigger,\n} from "@erbium/ui/components/drawer"\n```\n\n```tsx\n<Drawer>\n  <DrawerTrigger render={<Button variant="outline" />}>Open</DrawerTrigger>\n  <DrawerContent>\n    <DrawerHeader>\n      <DrawerTitle>Are you absolutely sure?</DrawerTitle>\n      <DrawerDescription>This action cannot be undone.</DrawerDescription>\n    </DrawerHeader>\n    <div className="p-4">{/* Content here */}</div>\n    <DrawerFooter>\n      <Button>Submit</Button>\n      <DrawerClose render={<Button variant="outline" />}>Cancel</DrawerClose>\n    </DrawerFooter>\n  </DrawerContent>\n</Drawer>\n```\n\n### Composition\n\nUse the following composition to build a `Drawer`:\n\n`DrawerContent` composes the portal, overlay, viewport, and popup from Base UI. For lower-level control, `DrawerPortal`, `DrawerOverlay`, and `DrawerSwipeHandle` are also exported.\n\n```text\nDrawer\n├── DrawerTrigger\n└── DrawerContent\n    ├── DrawerHeader\n    │   ├── DrawerTitle\n    │   └── DrawerDescription\n    └── DrawerFooter\n```\n\n### Migrating from Vaul\n\nThe base drawer now uses [Base UI](https://base-ui.com/react/components/drawer)\n\ninstead of Vaul. If you installed the previous base drawer, update your usage\n\nto the Base UI API.\n\nUse `down` instead of `bottom`, and `up` instead of `top`. `left` and `right`\n\nstay the same.\n\nFor `DrawerTrigger`, pass the trigger element to the `render` prop.\n\nFor `DrawerClose`, pass the close element to the `render` prop.\n\nIf you use snap points, rename the controlled snap point props and the sequential\n\nsnap point prop.\n\nVaul props like `handleOnly`, `repositionInputs`, and\n\n`shouldScaleBackground` do not have one-to-one replacements in the base drawer\n\nAPI. Use Base UI props such as `disablePointerDismissal`, `modal`, `snapPoints`,\n\nor controlled `open` state for the behavior you need.\n\nReplace Vaul\'s `data-vaul-drawer-direction` selectors with Base UI\'s\n\n`data-swipe-direction` selectors.\n\nBase UI also exposes attributes like `data-swiping`, `data-starting-style`, and\n\n`data-ending-style` for swipe and transition states. Descendants inside\n\n`DrawerContent` can use `group-data-[swipe-axis=x]/drawer-popup` and\n\n`group-data-[swipe-axis=y]/drawer-popup` for axis-specific styling.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{
  swipeDirection: "up" | "down" | "left" | "right";
  modal: boolean;
  showSwipeHandle: boolean;
}> = {
  args: { swipeDirection: "down", modal: true, showSwipeHandle: false },
  argTypes: {
    swipeDirection: { control: "select", options: ["up", "down", "left", "right"] },
    modal: { control: "boolean" },
    showSwipeHandle: { control: "boolean" },
  },
  render: (args) => (
    <Drawer
      swipeDirection={args.swipeDirection}
      modal={args.modal}
      showSwipeHandle={args.showSwipeHandle}
    >
      <DrawerTrigger>Open drawer</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Drawer title</DrawerTitle>
          <DrawerDescription>Drawer description.</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  Drawer,\n  DrawerClose,\n  DrawerContent,\n  DrawerDescription,\n  DrawerFooter,\n  DrawerHeader,\n  DrawerTitle,\n  DrawerTrigger,\n} from "@erbium/ui/components/drawer";\nexport default function DrawerDemo() {\n  return (\n    <Drawer>\n      <DrawerTrigger render={<Button variant="outline">Open drawer</Button>} />\n      <DrawerContent>\n        <DrawerHeader>\n          <DrawerTitle>Edit profile</DrawerTitle>\n          <DrawerDescription>Make changes and close when finished.</DrawerDescription>\n        </DrawerHeader>\n        <DrawerFooter>\n          <DrawerClose render={<Button>Done</Button>} />\n        </DrawerFooter>\n      </DrawerContent>\n    </Drawer>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const SwipeHandle: Story = {
  parameters: {
    docs: {
      description: { story: "Use `showSwipeHandle` on `Drawer` to render a swipe handle." },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  Drawer,\n  DrawerClose,\n  DrawerContent,\n  DrawerDescription,\n  DrawerFooter,\n  DrawerHeader,\n  DrawerTitle,\n  DrawerTrigger,\n} from "@erbium/ui/components/drawer";\n\nexport function DrawerSwipeHandle() {\n  return (\n    <Drawer showSwipeHandle>\n      <DrawerTrigger render={<Button variant="secondary" />}>Open Drawer</DrawerTrigger>\n      <DrawerContent>\n        <DrawerHeader>\n          <DrawerTitle>Drawer</DrawerTitle>\n          <DrawerDescription>Drawer with a swipe handle.</DrawerDescription>\n        </DrawerHeader>\n        <div className="flex-1 p-4">\n          <div className="rounded-2xl bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:h-80 group-data-[swipe-axis=y]/drawer-popup:w-full" />\n        </div>\n        <DrawerFooter>\n          <DrawerClose render={<Button />}>Close</DrawerClose>\n        </DrawerFooter>\n      </DrawerContent>\n    </Drawer>\n  );\n}\n',
      },
    },
  },
  render: () => <DrawerSwipeHandle />,
};
export const NonModal: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Set `modal={false}` to allow interaction with the rest of the page while the drawer is open. Combine with `disablePointerDismissal` to prevent the drawer from closing on outside presses. Use `modal="trap-focus"` to keep focus inside the drawer while leaving scroll and pointer interaction unrestricted.',
      },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  Drawer,\n  DrawerClose,\n  DrawerContent,\n  DrawerFooter,\n  DrawerHeader,\n  DrawerTitle,\n  DrawerTrigger,\n} from "@erbium/ui/components/drawer";\n\nexport function DrawerNonModal() {\n  return (\n    <Drawer modal={false} disablePointerDismissal swipeDirection="right">\n      <DrawerTrigger render={<Button variant="outline" />}>Non Modal</DrawerTrigger>\n      <DrawerContent>\n        <DrawerHeader>\n          <DrawerTitle>Non Modal Drawer</DrawerTitle>\n        </DrawerHeader>\n        <div className="flex-1 p-4">\n          <div className="rounded-2xl bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:h-80 group-data-[swipe-axis=y]/drawer-popup:w-full" />\n        </div>\n        <DrawerFooter>\n          <DrawerClose render={<Button />}>Close</DrawerClose>\n        </DrawerFooter>\n      </DrawerContent>\n    </Drawer>\n  );\n}\n',
      },
    },
  },
  render: () => <DrawerNonModal />,
};
export const SnapPoints: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use `snapPoints` to snap a drawer to preset heights. Numbers between `0` and `1` represent fractions of the viewport. Numbers greater than `1` are treated as pixel values. String values support `px` and `rem` units. Snap points apply to vertical drawers.\n\nTrack the active snap point with the controlled `snapPoint` and `onSnapPointChange` props. At the full snap point, the drawer gets a `data-expanded` attribute you can style with the `data-expanded:` variant.",
      },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  Drawer,\n  DrawerClose,\n  DrawerContent,\n  DrawerDescription,\n  DrawerFooter,\n  DrawerHeader,\n  DrawerTitle,\n  DrawerTrigger,\n} from "@erbium/ui/components/drawer";\n\nconst SNAP_POINTS = ["31rem", 1];\n\nexport function DrawerSnapPoints() {\n  return (\n    <Drawer snapPoints={SNAP_POINTS} showSwipeHandle>\n      <DrawerTrigger render={<Button variant="outline" />}>Open Snap Drawer</DrawerTrigger>\n      <DrawerContent>\n        <DrawerHeader>\n          <DrawerTitle>Snap points</DrawerTitle>\n          <DrawerDescription>\n            Drag the drawer to snap between a compact peek and a near full-height view.\n          </DrawerDescription>\n        </DrawerHeader>\n        <div className="flex-1 p-4">\n          <div className="rounded-2xl bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:h-80 group-data-[swipe-axis=y]/drawer-popup:w-full" />\n        </div>\n        <DrawerFooter>\n          <DrawerClose render={<Button />}>Close</DrawerClose>\n        </DrawerFooter>\n      </DrawerContent>\n    </Drawer>\n  );\n}\n',
      },
    },
  },
  render: () => <DrawerSnapPoints />,
};

export const Position: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the `swipeDirection` prop to set the side of the drawer.\n\nAvailable options are `up`, `right`, `down`, and `left`.",
      },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  Drawer,\n  DrawerClose,\n  DrawerContent,\n  DrawerDescription,\n  DrawerFooter,\n  DrawerHeader,\n  DrawerTitle,\n  DrawerTrigger,\n} from "@erbium/ui/components/drawer";\n\nexport function DrawerWithSides() {\n  return (\n    <Drawer swipeDirection="left">\n      <DrawerTrigger render={<Button variant="secondary" />}>Open Left Drawer</DrawerTrigger>\n      <DrawerContent>\n        <DrawerHeader>\n          <DrawerTitle>Move Goal</DrawerTitle>\n          <DrawerDescription>Set your daily activity goal.</DrawerDescription>\n        </DrawerHeader>\n        <div className="flex-1 p-4">\n          <div className="size-full rounded-2xl bg-muted" />\n        </div>\n        <DrawerFooter>\n          <DrawerClose render={<Button />}>Close</DrawerClose>\n        </DrawerFooter>\n      </DrawerContent>\n    </Drawer>\n  );\n}\n',
      },
    },
  },
  render: () => <DrawerWithSides />,
};

export const Nested: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Open drawers from inside another drawer. Parent drawers stay mounted and stack behind the frontmost drawer.",
      },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  Drawer,\n  DrawerClose,\n  DrawerContent,\n  DrawerDescription,\n  DrawerFooter,\n  DrawerHeader,\n  DrawerTitle,\n  DrawerTrigger,\n} from "@erbium/ui/components/drawer";\n\nexport function DrawerNested() {\n  const isMobile = false;\n\n  const swipeDirection = isMobile ? "down" : "right";\n\n  return (\n    <Drawer showSwipeHandle={isMobile} swipeDirection={swipeDirection}>\n      <DrawerTrigger render={<Button variant="secondary" />}>Open Drawer</DrawerTrigger>\n      <DrawerContent>\n        <DrawerHeader>\n          <DrawerTitle>Drawer</DrawerTitle>\n          <DrawerDescription>Open another drawer from the same direction.</DrawerDescription>\n        </DrawerHeader>\n        <div className="flex-1 p-4">\n          <div className="bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:aspect-video group-data-[swipe-axis=y]/drawer-popup:w-full" />\n        </div>\n        <DrawerFooter>\n          <Drawer showSwipeHandle={isMobile} swipeDirection={swipeDirection}>\n            <DrawerTrigger render={<Button variant="outline" />}>Open Nested Drawer</DrawerTrigger>\n            <DrawerContent>\n              <DrawerHeader>\n                <DrawerTitle>Nested Drawer</DrawerTitle>\n                <DrawerDescription>\n                  The parent drawer stays mounted behind this one.\n                </DrawerDescription>\n              </DrawerHeader>\n              <div className="flex-1 p-4">\n                <div className="bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:aspect-video group-data-[swipe-axis=y]/drawer-popup:w-full" />\n              </div>\n              <DrawerFooter>\n                <Drawer showSwipeHandle={isMobile} swipeDirection={swipeDirection}>\n                  <DrawerTrigger render={<Button variant="outline" />}>\n                    Open Third Drawer\n                  </DrawerTrigger>\n                  <DrawerContent>\n                    <DrawerHeader>\n                      <DrawerTitle>Third Drawer</DrawerTitle>\n                      <DrawerDescription>\n                        Two drawers are stacked behind this one.\n                      </DrawerDescription>\n                    </DrawerHeader>\n                    <div className="flex-1 p-4">\n                      <div className="bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:aspect-video group-data-[swipe-axis=y]/drawer-popup:w-full" />\n                    </div>\n                    <DrawerFooter>\n                      <Drawer showSwipeHandle={isMobile} swipeDirection={swipeDirection}>\n                        <DrawerTrigger render={<Button variant="outline" />}>\n                          Open Fourth Drawer\n                        </DrawerTrigger>\n                        <DrawerContent>\n                          <DrawerHeader>\n                            <DrawerTitle>Fourth Drawer</DrawerTitle>\n                            <DrawerDescription>\n                              This is the frontmost drawer in the stack.\n                            </DrawerDescription>\n                          </DrawerHeader>\n                          <div className="flex-1 p-4">\n                            <div className="bg-muted group-data-[swipe-axis=x]/drawer-popup:size-full group-data-[swipe-axis=y]/drawer-popup:aspect-video group-data-[swipe-axis=y]/drawer-popup:w-full" />\n                          </div>\n                          <DrawerFooter>\n                            <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>\n                          </DrawerFooter>\n                        </DrawerContent>\n                      </Drawer>\n                      <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>\n                    </DrawerFooter>\n                  </DrawerContent>\n                </Drawer>\n                <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>\n              </DrawerFooter>\n            </DrawerContent>\n          </Drawer>\n          <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>\n        </DrawerFooter>\n      </DrawerContent>\n    </Drawer>\n  );\n}\n',
      },
    },
  },
  render: () => <DrawerNested />,
};
export const CustomSizes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A vertical drawer sizes itself to its content and is capped at `calc(100dvh - 6rem)` by default. A side drawer spans `75%` of the viewport width, or `24rem` on larger screens.\n\nTo customize the height of a vertical drawer, use the `h-*` and `max-h-*` utilities on `DrawerContent`.\n\nTo customize the width of a side drawer, use the `w-*` and `max-w-*` utilities on `DrawerContent`.\n\nWhen the same component renders in multiple directions, scope an override to one axis using the `data-[swipe-axis=*]` variants.\n\nTo make a region of the drawer scrollable, make the scroll container a flex item. Avoid `h-full`, which does not resolve inside a content-sized drawer.\n\n```tsx\n<DrawerContent className="h-[50vh]">\n```\n\n```tsx\n<DrawerContent className="w-96">\n```\n\n```tsx\n<DrawerContent className="data-[swipe-axis=y]:max-h-[50vh] data-[swipe-axis=x]:w-96">\n```\n\n```tsx\n<DrawerContent>\n  <DrawerHeader>...</DrawerHeader>\n  <div className="flex-1 overflow-y-auto p-4">{/* Scrollable content */}</div>\n  <DrawerFooter>...</DrawerFooter>\n</DrawerContent>\n```',
      },
      source: {
        code: 'import * as React from "react";\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  Drawer,\n  DrawerClose,\n  DrawerContent,\n  DrawerDescription,\n  DrawerFooter,\n  DrawerHeader,\n  DrawerTitle,\n  DrawerTrigger,\n} from "@erbium/ui/components/drawer";\nimport {\n  Dialog,\n  DialogContent,\n  DialogDescription,\n  DialogHeader,\n  DialogTitle,\n  DialogTrigger,\n} from "@erbium/ui/components/dialog";\n\nfunction DrawerExample({ className, label }: { className?: string; label: string }) {\n  return (\n    <Drawer>\n      <DrawerTrigger render={<Button variant="outline" />}>{label}</DrawerTrigger>\n      <DrawerContent className={className}>\n        <DrawerHeader>\n          <DrawerTitle>{label}</DrawerTitle>\n          <DrawerDescription>Adjust the drawer layout for your content.</DrawerDescription>\n        </DrawerHeader>\n        <div className="min-h-20 flex-1 overflow-y-auto p-4">\n          This region scrolls when the content grows.\n        </div>\n        <DrawerFooter>\n          <DrawerClose render={<Button />}>Done</DrawerClose>\n        </DrawerFooter>\n      </DrawerContent>\n    </Drawer>\n  );\n}\n\nexport function CustomSizes() {\n  return <DrawerExample className="h-[50vh] max-h-[50vh]" label="Open half-height drawer" />;\n}\n\nexport function Styling() {\n  return (\n    <DrawerExample\n      className="[--drawer-inset:--spacing(4)] [--drawer-bleed-background:var(--color-muted)]"\n      label="Open inset drawer"\n    />\n  );\n}\n\nfunction useIsNarrow() {\n  const [narrow, setNarrow] = React.useState(false);\n  React.useEffect(() => {\n    const query = window.matchMedia("(max-width: 640px)");\n    const update = () => setNarrow(query.matches);\n    update();\n    query.addEventListener("change", update);\n    return () => query.removeEventListener("change", update);\n  }, []);\n  return narrow;\n}\n\nexport function Responsive() {\n  const narrow = useIsNarrow();\n  if (narrow) return <DrawerExample label="Edit profile" />;\n  return (\n    <Dialog>\n      <DialogTrigger render={<Button variant="outline" />}>Edit profile</DialogTrigger>\n      <DialogContent>\n        <DialogHeader>\n          <DialogTitle>Edit profile</DialogTitle>\n          <DialogDescription>\n            The dialog is used above 640px; resize to see a drawer.\n          </DialogDescription>\n        </DialogHeader>\n      </DialogContent>\n    </Dialog>\n  );\n}\n',
      },
    },
  },
  render: () => <CustomSizesExample />,
};
export const Styling: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The drawer exposes CSS variables for style-level customization. Set the sizing variables on `DrawerContent`. Set the overlay variable on `[data-slot=drawer-overlay]` in your CSS.\n\n| Variable                       | Default                | Description                                                             |\n\n| ------------------------------ | ---------------------- | ----------------------------------------------------------------------- |\n\n| `--drawer-inset`               | `0px`                  | Floats the drawer from the viewport edges.                              |\n\n| `--drawer-bleed-background`    | `var(--color-popover)` | Fills the gap behind the drawer on swipe overshoot.                     |\n\n| `--drawer-overlay-min-opacity` | `0`                    | Minimum overlay opacity. Defaults to `0.5` when snap points are active. |\n\nThe drawer also sets data attributes you can target with variants such as `data-[swipe-direction=down]:` on `DrawerContent`, or `group-data-[swipe-axis=y]/drawer-popup:` on its descendants.\n\n| Attribute                 | Values                        | Set when                              |\n\n| ------------------------- | ----------------------------- | ------------------------------------- |\n\n| `data-swipe-direction`    | `up`, `right`, `down`, `left` | Always.                               |\n\n| `data-swipe-axis`         | `x`, `y`                      | Always.                               |\n\n| `data-snap-points`        | Present                       | The drawer has snap points.           |\n\n| `data-expanded`           | Present                       | The drawer is at the full snap point. |\n\n| `data-swiping`            | Present                       | A swipe is in progress.               |\n\n| `data-nested-drawer-open` | Present                       | A nested drawer is open on top.       |",
      },
      source: {
        code: 'import * as React from "react";\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  Drawer,\n  DrawerClose,\n  DrawerContent,\n  DrawerDescription,\n  DrawerFooter,\n  DrawerHeader,\n  DrawerTitle,\n  DrawerTrigger,\n} from "@erbium/ui/components/drawer";\nimport {\n  Dialog,\n  DialogContent,\n  DialogDescription,\n  DialogHeader,\n  DialogTitle,\n  DialogTrigger,\n} from "@erbium/ui/components/dialog";\n\nfunction DrawerExample({ className, label }: { className?: string; label: string }) {\n  return (\n    <Drawer>\n      <DrawerTrigger render={<Button variant="outline" />}>{label}</DrawerTrigger>\n      <DrawerContent className={className}>\n        <DrawerHeader>\n          <DrawerTitle>{label}</DrawerTitle>\n          <DrawerDescription>Adjust the drawer layout for your content.</DrawerDescription>\n        </DrawerHeader>\n        <div className="min-h-20 flex-1 overflow-y-auto p-4">\n          This region scrolls when the content grows.\n        </div>\n        <DrawerFooter>\n          <DrawerClose render={<Button />}>Done</DrawerClose>\n        </DrawerFooter>\n      </DrawerContent>\n    </Drawer>\n  );\n}\n\nexport function CustomSizes() {\n  return <DrawerExample className="h-[50vh] max-h-[50vh]" label="Open half-height drawer" />;\n}\n\nexport function Styling() {\n  return (\n    <DrawerExample\n      className="[--drawer-inset:--spacing(4)] [--drawer-bleed-background:var(--color-muted)]"\n      label="Open inset drawer"\n    />\n  );\n}\n\nfunction useIsNarrow() {\n  const [narrow, setNarrow] = React.useState(false);\n  React.useEffect(() => {\n    const query = window.matchMedia("(max-width: 640px)");\n    const update = () => setNarrow(query.matches);\n    update();\n    query.addEventListener("change", update);\n    return () => query.removeEventListener("change", update);\n  }, []);\n  return narrow;\n}\n\nexport function Responsive() {\n  const narrow = useIsNarrow();\n  if (narrow) return <DrawerExample label="Edit profile" />;\n  return (\n    <Dialog>\n      <DialogTrigger render={<Button variant="outline" />}>Edit profile</DialogTrigger>\n      <DialogContent>\n        <DialogHeader>\n          <DialogTitle>Edit profile</DialogTitle>\n          <DialogDescription>\n            The dialog is used above 640px; resize to see a drawer.\n          </DialogDescription>\n        </DialogHeader>\n      </DialogContent>\n    </Dialog>\n  );\n}\n',
      },
    },
  },
  render: () => <StylingExample />,
};
export const Responsive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "You can combine the `Dialog` and `Drawer` components to create a responsive dialog. This renders a `Dialog` component on desktop and a `Drawer` on mobile.",
      },
      source: {
        code: 'import * as React from "react";\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  Drawer,\n  DrawerClose,\n  DrawerContent,\n  DrawerDescription,\n  DrawerFooter,\n  DrawerHeader,\n  DrawerTitle,\n  DrawerTrigger,\n} from "@erbium/ui/components/drawer";\nimport {\n  Dialog,\n  DialogContent,\n  DialogDescription,\n  DialogHeader,\n  DialogTitle,\n  DialogTrigger,\n} from "@erbium/ui/components/dialog";\n\nfunction DrawerExample({ className, label }: { className?: string; label: string }) {\n  return (\n    <Drawer>\n      <DrawerTrigger render={<Button variant="outline" />}>{label}</DrawerTrigger>\n      <DrawerContent className={className}>\n        <DrawerHeader>\n          <DrawerTitle>{label}</DrawerTitle>\n          <DrawerDescription>Adjust the drawer layout for your content.</DrawerDescription>\n        </DrawerHeader>\n        <div className="min-h-20 flex-1 overflow-y-auto p-4">\n          This region scrolls when the content grows.\n        </div>\n        <DrawerFooter>\n          <DrawerClose render={<Button />}>Done</DrawerClose>\n        </DrawerFooter>\n      </DrawerContent>\n    </Drawer>\n  );\n}\n\nexport function CustomSizes() {\n  return <DrawerExample className="h-[50vh] max-h-[50vh]" label="Open half-height drawer" />;\n}\n\nexport function Styling() {\n  return (\n    <DrawerExample\n      className="[--drawer-inset:--spacing(4)] [--drawer-bleed-background:var(--color-muted)]"\n      label="Open inset drawer"\n    />\n  );\n}\n\nfunction useIsNarrow() {\n  const [narrow, setNarrow] = React.useState(false);\n  React.useEffect(() => {\n    const query = window.matchMedia("(max-width: 640px)");\n    const update = () => setNarrow(query.matches);\n    update();\n    query.addEventListener("change", update);\n    return () => query.removeEventListener("change", update);\n  }, []);\n  return narrow;\n}\n\nexport function Responsive() {\n  const narrow = useIsNarrow();\n  if (narrow) return <DrawerExample label="Edit profile" />;\n  return (\n    <Dialog>\n      <DialogTrigger render={<Button variant="outline" />}>Edit profile</DialogTrigger>\n      <DialogContent>\n        <DialogHeader>\n          <DialogTitle>Edit profile</DialogTitle>\n          <DialogDescription>\n            The dialog is used above 640px; resize to see a drawer.\n          </DialogDescription>\n        </DialogHeader>\n      </DialogContent>\n    </Dialog>\n  );\n}\n',
      },
    },
  },
  render: () => <ResponsiveExample />,
};
