import ExampleSpinnerSize from "../examples/spinner-size";
import ExampleSpinnerButton from "../examples/spinner-button";
import ExampleSpinnerBadge from "../examples/spinner-badge";
import ExampleSpinnerInputGroup from "../examples/spinner-input-group";
import ExampleSpinnerEmpty from "../examples/spinner-empty";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Spinner } from "@erbium/ui/components/spinner";
import Demo from "../examples/spinner-demo";

const meta = {
  title: "UI/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'An indicator that can be used to show a loading state.\n\n**Import:** `@erbium/ui/components/spinner`  \n\n**shadcn/ui page:** [Spinner](https://ui.shadcn.com/docs/components/base/spinner)\n\n### Usage\n\n```tsx\nimport { Spinner } from "@erbium/ui/components/spinner"\n```\n\n```tsx\n<Spinner />\n```',
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
        code: 'import { Item, ItemContent, ItemMedia, ItemTitle } from "@erbium/ui/components/item";\nimport { Spinner } from "@erbium/ui/components/spinner";\n\nexport default function SpinnerDemo() {\n  return (\n    <div className="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]">\n      <Item variant="muted">\n        <ItemMedia>\n          <Spinner />\n        </ItemMedia>\n        <ItemContent>\n          <ItemTitle className="line-clamp-1">Processing payment...</ItemTitle>\n        </ItemContent>\n        <ItemContent className="flex-none justify-end">\n          <span className="text-sm tabular-nums">$100.00</span>\n        </ItemContent>\n      </Item>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const Size: Story = {
  parameters: {
    docs: {
      description: { story: "Use the `size-*` utility class to change the size of the spinner." },

      source: {
        code: 'import { Spinner } from "@erbium/ui/components/spinner"\n\nexport default function SpinnerSize() {\n  return (\n    <div className="flex items-center gap-6">\n      <Spinner className="size-3" />\n      <Spinner className="size-4" />\n      <Spinner className="size-6" />\n      <Spinner className="size-8" />\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleSpinnerSize />
    </div>
  ),
};
export const Button: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Add a spinner to a button to indicate a loading state. Place the `<Spinner />` before the label with `data-icon="inline-start"` for a start position, or after the label with `data-icon="inline-end"` for an end position.',
      },

      source: {
        code: 'import { Button } from "@erbium/ui/components/button"\nimport { Spinner } from "@erbium/ui/components/spinner"\n\nexport default function SpinnerButton() {\n  return (\n    <div className="flex flex-col items-center gap-4">\n      <Button disabled size="sm">\n        <Spinner />\n        Loading...\n      </Button>\n      <Button variant="outline" disabled size="sm">\n        <Spinner />\n        Please wait\n      </Button>\n      <Button variant="secondary" disabled size="sm">\n        <Spinner />\n        Processing\n      </Button>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleSpinnerButton />
    </div>
  ),
};
export const Badge: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Add a spinner to a badge to indicate a loading state. Place the `<Spinner />` before the label with `data-icon="inline-start"` for a start position, or after the label with `data-icon="inline-end"` for an end position.',
      },

      source: {
        code: 'import { Badge } from "@erbium/ui/components/badge"\nimport { Spinner } from "@erbium/ui/components/spinner"\n\nexport default function SpinnerBadge() {\n  return (\n    <div className="flex items-center gap-4 [--radius:1.2rem]">\n      <Badge>\n        <Spinner />\n        Syncing\n      </Badge>\n      <Badge variant="secondary">\n        <Spinner />\n        Updating\n      </Badge>\n      <Badge variant="outline">\n        <Spinner />\n        Processing\n      </Badge>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleSpinnerBadge />
    </div>
  ),
};
export const InputGroup: Story = {
  parameters: {
    docs: {
      description: { story: "Show progress inside an input group." },

      source: {
        code: 'import { ArrowUpIcon } from "lucide-react"\n\nimport {\n  InputGroup,\n  InputGroupAddon,\n  InputGroupButton,\n  InputGroupInput,\n  InputGroupTextarea,\n} from "@erbium/ui/components/input-group"\nimport { Spinner } from "@erbium/ui/components/spinner"\n\nexport default function SpinnerInputGroup() {\n  return (\n    <div className="flex w-full max-w-md flex-col gap-4">\n      <InputGroup>\n        <InputGroupInput placeholder="Send a message..." disabled />\n        <InputGroupAddon align="inline-end">\n          <Spinner />\n        </InputGroupAddon>\n      </InputGroup>\n      <InputGroup>\n        <InputGroupTextarea placeholder="Send a message..." disabled />\n        <InputGroupAddon align="block-end">\n          <Spinner /> Validating...\n          <InputGroupButton className="ml-auto" variant="default">\n            <ArrowUpIcon />\n            <span className="sr-only">Send</span>\n          </InputGroupButton>\n        </InputGroupAddon>\n      </InputGroup>\n    </div>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleSpinnerInputGroup />
    </div>
  ),
};
export const Empty: Story = {
  parameters: {
    docs: {
      description: { story: "Show progress in an empty state." },

      source: {
        code: 'import { Button } from "@erbium/ui/components/button"\nimport {\n  Empty,\n  EmptyContent,\n  EmptyDescription,\n  EmptyHeader,\n  EmptyMedia,\n  EmptyTitle,\n} from "@erbium/ui/components/empty"\nimport { Spinner } from "@erbium/ui/components/spinner"\n\nexport default function SpinnerEmpty() {\n  return (\n    <Empty className="w-full">\n      <EmptyHeader>\n        <EmptyMedia variant="icon">\n          <Spinner />\n        </EmptyMedia>\n        <EmptyTitle>Processing your request</EmptyTitle>\n        <EmptyDescription>\n          Please wait while we process your request. Do not refresh the page.\n        </EmptyDescription>\n      </EmptyHeader>\n      <EmptyContent>\n        <Button variant="outline" size="sm">\n          Cancel\n        </Button>\n      </EmptyContent>\n    </Empty>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleSpinnerEmpty />
    </div>
  ),
};
