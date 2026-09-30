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
          'Displays a card with header, content, and footer. Use `size="sm"` for compact spacing.\n\n**Import:** `@erbium/ui/components/card`  \n\n**shadcn/ui page:** [Card](https://ui.shadcn.com/docs/components/base/card)\n\n### Usage\n\n```tsx\nimport {\n  Card,\n  CardAction,\n  CardContent,\n  CardDescription,\n  CardFooter,\n  CardHeader,\n  CardTitle,\n} from "@erbium/ui/components/card"\n```\n\n```tsx\n<Card>\n  <CardHeader>\n    <CardTitle>Card Title</CardTitle>\n    <CardDescription>Card Description</CardDescription>\n    <CardAction>Card Action</CardAction>\n  </CardHeader>\n  <CardContent>\n    <p>Card Content</p>\n  </CardContent>\n  <CardFooter>\n    <p>Card Footer</p>\n  </CardFooter>\n</Card>\n```\n\n### Composition\n\nUse the following composition to build a `Card`:\n\n```text\nCard\n├── CardHeader\n│   ├── CardTitle\n│   ├── CardDescription\n│   └── CardAction\n├── CardContent\n└── CardFooter\n```',
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<typeof Card> = {
  args: { size: "default" },
  argTypes: {
    size: { control: "select", options: ["default", "sm"] },
    className: { table: { disable: true } },
  },
  render: (args) => (
    <Card {...args} className="w-80">
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
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  Card,\n  CardAction,\n  CardContent,\n  CardDescription,\n  CardFooter,\n  CardHeader,\n  CardTitle,\n} from "@erbium/ui/components/card";\nimport { Input } from "@erbium/ui/components/input";\nimport { Label } from "@erbium/ui/components/label";\nimport { StatefulButton } from "@erbium/ui/components/stateful-button";\n\nexport default function CardDemo() {\n  return (\n    <Card className="w-full max-w-sm">\n      <CardHeader>\n        <CardTitle>Login to your account</CardTitle>\n        <CardDescription>Enter your email below to login to your account</CardDescription>\n        <CardAction>\n          <Button variant="link">Sign Up</Button>\n        </CardAction>\n      </CardHeader>\n      <CardContent>\n        <form id="card-login-form" onSubmit={(event) => event.preventDefault()}>\n          <div className="flex flex-col gap-6">\n            <div className="grid gap-2">\n              <Label htmlFor="email">Email</Label>\n              <Input id="email" type="email" placeholder="m@example.com" required />\n            </div>\n            <div className="grid gap-2">\n              <div className="flex items-center">\n                <Label htmlFor="password">Password</Label>\n                <a\n                  href="#"\n                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"\n                >\n                  Forgot your password?\n                </a>\n              </div>\n              <Input id="password" type="password" required />\n            </div>\n          </div>\n        </form>\n      </CardContent>\n      <CardFooter className="gap-2">\n        <StatefulButton type="submit" form="card-login-form" className="min-w-0 flex-1">\n          Login\n        </StatefulButton>\n        <Button variant="outline" className="shrink-0">\n          Login with Google\n        </Button>\n      </CardFooter>\n    </Card>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

function SampleCard({ size }: { size?: "sm" }) {
  return (
    <Card className="w-80" size={size}>
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
      <CardContent className="px-0">
        <div className="border-t bg-muted p-4">Content runs to the card edges.</div>
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
      <img
        src="/card-project.svg"
        alt="Abstract illustration of a project dashboard"
        className="h-40 w-full object-cover"
      />
      <CardHeader>
        <CardTitle>Featured project</CardTitle>
        <CardDescription>A card with media above its header.</CardDescription>
      </CardHeader>
    </Card>
  ),
};
