import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Tabs } from "@erbium/ui/components/tabs";
import Demo from "./examples/tabs-demo";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A set of layered sections of content—known as tab panels—that are displayed one at a time.\n\n**Import:** `@erbium/ui/components/tabs`  \n\n**shadcn/ui page:** [Tabs](https://ui.shadcn.com/docs/components/base/tabs)\n\n### Usage\n\n```tsx\nimport { Tabs, TabsContent, TabsList, TabsTrigger } from "@erbium/ui/components/tabs"\n```\n\n```tsx\n<Tabs defaultValue="account" className="w-[400px]">\n  <TabsList>\n    <TabsTrigger value="account">Account</TabsTrigger>\n    <TabsTrigger value="password">Password</TabsTrigger>\n  </TabsList>\n  <TabsContent value="account">Make changes to your account here.</TabsContent>\n  <TabsContent value="password">Change your password here.</TabsContent>\n</Tabs>\n```\n\n### Composition\n\nUse the following composition to build `Tabs`:\n\n```text\nTabs\n├── TabsList\n│   ├── TabsTrigger\n│   └── TabsTrigger\n├── TabsContent\n└── TabsContent\n```\n\n### Line\n\nUse the `variant="line"` prop on `TabsList` for a line style.\n\n### Vertical\n\nUse `orientation="vertical"` for vertical tabs.\n\n### Disabled\n\n### Icons',
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
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  Card,\n  CardContent,\n  CardDescription,\n  CardFooter,\n  CardHeader,\n  CardTitle,\n} from "@erbium/ui/components/card";\nimport { Input } from "@erbium/ui/components/input";\nimport { Label } from "@erbium/ui/components/label";\nimport { Tabs, TabsContent, TabsList, TabsTrigger } from "@erbium/ui/components/tabs";\n\nexport default function TabsDemo() {\n  return (\n    <div className="flex w-full max-w-sm flex-col gap-6">\n      <Tabs defaultValue="account">\n        <TabsList>\n          <TabsTrigger value="account">Account</TabsTrigger>\n          <TabsTrigger value="password">Password</TabsTrigger>\n        </TabsList>\n        <TabsContent value="account">\n          <Card>\n            <CardHeader>\n              <CardTitle>Account</CardTitle>\n              <CardDescription>\n                Make changes to your account here. Click save when you&apos;re done.\n              </CardDescription>\n            </CardHeader>\n            <CardContent className="grid gap-6">\n              <div className="grid gap-3">\n                <Label htmlFor="tabs-demo-name">Name</Label>\n                <Input id="tabs-demo-name" defaultValue="Pedro Duarte" />\n              </div>\n              <div className="grid gap-3">\n                <Label htmlFor="tabs-demo-username">Username</Label>\n                <Input id="tabs-demo-username" defaultValue="@peduarte" />\n              </div>\n            </CardContent>\n            <CardFooter>\n              <Button>Save changes</Button>\n            </CardFooter>\n          </Card>\n        </TabsContent>\n        <TabsContent value="password">\n          <Card>\n            <CardHeader>\n              <CardTitle>Password</CardTitle>\n              <CardDescription>\n                Change your password here. After saving, you&apos;ll be logged out.\n              </CardDescription>\n            </CardHeader>\n            <CardContent className="grid gap-6">\n              <div className="grid gap-3">\n                <Label htmlFor="tabs-demo-current">Current password</Label>\n                <Input id="tabs-demo-current" type="password" />\n              </div>\n              <div className="grid gap-3">\n                <Label htmlFor="tabs-demo-new">New password</Label>\n                <Input id="tabs-demo-new" type="password" />\n              </div>\n            </CardContent>\n            <CardFooter>\n              <Button>Save password</Button>\n            </CardFooter>\n          </Card>\n        </TabsContent>\n      </Tabs>\n    </div>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};
