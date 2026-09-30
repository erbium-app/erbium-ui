import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@erbium/ui/components/card";
import Demo from "../examples/card-demo";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays a card with header, content, and footer.\n\n**Import:** `@erbium/ui/components/card`  \n\n**shadcn/ui page:** [Card](https://ui.shadcn.com/docs/components/base/card)\n\n### Usage\n\n```tsx\nimport {\n  Card,\n  CardAction,\n  CardContent,\n  CardDescription,\n  CardFooter,\n  CardHeader,\n  CardTitle,\n} from "@erbium/ui/components/card"\n```\n\n```tsx\n<Card>\n  <CardHeader>\n    <CardTitle>Card Title</CardTitle>\n    <CardDescription>Card Description</CardDescription>\n    <CardAction>Card Action</CardAction>\n  </CardHeader>\n  <CardContent>\n    <p>Card Content</p>\n  </CardContent>\n  <CardFooter>\n    <p>Card Footer</p>\n  </CardFooter>\n</Card>\n```\n\n### Composition\n\nUse the following composition to build a `Card`:\n\n```text\nCard\n├── CardHeader\n│   ├── CardTitle\n│   ├── CardDescription\n│   └── CardAction\n├── CardContent\n└── CardFooter\n```\n\n### Changelog\n\nIf you\'re upgrading from a previous version of the `Card` component, you\'ll need to apply the following updates to use the `--card-spacing` variable:\n\nReplace the hard-coded gap and vertical padding with `--card-spacing`, and set the default and small size values on the root:\n\nReplace the horizontal padding and border spacing with the shared variable:\n\nUse `--card-spacing` for the content inset and footer padding:\n\nAfter applying these changes, you can customize card spacing by setting `--card-spacing` on the `Card` with an arbitrary property class:\n\n```tsx\nfunction Example() {\n  return <Card className="[--card-spacing:--spacing(6)]">...</Card>\n}\n```',
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof Card> = {
  args: { size: "default", className: "" },
  argTypes: { size: { control: "select", options: ["default", "sm"] } },
  render: (args) => (
    <Card {...args} className={`w-80 ${args.className ?? ""}`}>
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description</CardDescription>
      </CardHeader>
      <CardContent>Card content</CardContent>
      <CardFooter>Card footer</CardFooter>
    </Card>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  Card,\n  CardAction,\n  CardContent,\n  CardDescription,\n  CardFooter,\n  CardHeader,\n  CardTitle,\n} from "@erbium/ui/components/card";\nimport { Input } from "@erbium/ui/components/input";\nimport { Label } from "@erbium/ui/components/label";\nimport { StatusButton } from "@erbium/ui/components/status-button";\n\nexport default function CardDemo() {\n  return (\n    <Card className="w-full max-w-sm">\n      <CardHeader>\n        <CardTitle>Login to your account</CardTitle>\n        <CardDescription>Enter your email below to login to your account</CardDescription>\n        <CardAction>\n          <Button variant="link">Sign Up</Button>\n        </CardAction>\n      </CardHeader>\n      <CardContent>\n        <form id="card-login-form" onSubmit={(event) => event.preventDefault()}>\n          <div className="flex flex-col gap-6">\n            <div className="grid gap-2">\n              <Label htmlFor="email">Email</Label>\n              <Input id="email" type="email" placeholder="m@example.com" required />\n            </div>\n            <div className="grid gap-2">\n              <div className="flex items-center">\n                <Label htmlFor="password">Password</Label>\n                <a\n                  href="#"\n                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"\n                >\n                  Forgot your password?\n                </a>\n              </div>\n              <Input id="password" type="password" required />\n            </div>\n          </div>\n        </form>\n      </CardContent>\n      <CardFooter className="flex-col gap-2">\n        <StatusButton type="submit" form="card-login-form" className="w-full">\n          Login\n        </StatusButton>\n        <Button variant="outline" className="w-full">\n          Login with Google\n        </Button>\n      </CardFooter>\n    </Card>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

function SampleCard({ size, className }: { size?: "sm"; className?: string }) {
  return (
    <Card className={`w-80 ${className ?? ""}`} size={size}>
      <CardHeader>
        <CardTitle>Project update</CardTitle>
        <CardDescription>Everything you need to know at a glance.</CardDescription>
      </CardHeader>
      <CardContent>Review the latest changes and share your feedback.</CardContent>
      <CardFooter>Updated today</CardFooter>
    </Card>
  );
}

export const Small: Story = {
  name: "Size",
  parameters: {
    docs: {
      description: {
        story:
          'Use the `size="sm"` prop to set the size of the card to small. The small size variant uses smaller spacing.',
      },
    },
  },
  render: () => <SampleCard size="sm" />,
};
export const Spacing: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "In addition to the `size` prop, you can use the `--card-spacing` CSS variable to control the spacing between sections and the inset of card parts.\n\nUse negative margins with `-mx-(--card-spacing)` to make content go edge to edge while keeping it aligned with the card inset. When the edge-to-edge content sits above a footer, use `-mb-(--card-spacing)` on `CardContent` to remove the section gap.",
      },
    },
  },

  render: () => <SampleCard className="[--card-spacing:--spacing(8)]" />,
};
export const EdgeToEdge: Story = {
  parameters: {
    docs: {
      description: { story: "Place media flush with the card edges." },
    },
  },

  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="-mx-(--card-spacing) border-y bg-muted p-4">
          Content runs to the card edges.
        </div>
      </CardContent>
      <CardFooter>View all activity</CardFooter>
    </Card>
  ),
};
export const Image: Story = {
  parameters: {
    docs: {
      description: { story: "Add an image before the card header to create a card with an image." },
    },
  },

  render: () => (
    <Card className="w-80">
      <div className="flex h-40 items-center justify-center bg-muted">Image area</div>
      <CardHeader>
        <CardTitle>Featured project</CardTitle>
        <CardDescription>A card with media above its header.</CardDescription>
      </CardHeader>
    </Card>
  ),
};
