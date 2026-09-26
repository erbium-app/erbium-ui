import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@erbium/ui/components/navigation-menu";
import Demo from "../examples/navigation-menu-demo";

const meta = {
  title: "UI/Navigation Menu",
  component: NavigationMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A collection of links for navigating websites.\n\n**Import:** `@erbium/ui/components/navigation-menu`  \n\n**shadcn/ui page:** [Navigation Menu](https://ui.shadcn.com/docs/components/base/navigation-menu)\n\n### Usage\n\n```tsx\nimport {\n  NavigationMenu,\n  NavigationMenuContent,\n  NavigationMenuItem,\n  NavigationMenuLink,\n  NavigationMenuList,\n  NavigationMenuTrigger,\n} from "@erbium/ui/components/navigation-menu"\n```\n\n```tsx\n<NavigationMenu>\n  <NavigationMenuList>\n    <NavigationMenuItem>\n      <NavigationMenuTrigger>Item One</NavigationMenuTrigger>\n      <NavigationMenuContent>\n        <NavigationMenuLink>Link</NavigationMenuLink>\n      </NavigationMenuContent>\n    </NavigationMenuItem>\n  </NavigationMenuList>\n</NavigationMenu>\n```\n\n### Composition\n\nUse the following composition to build a `NavigationMenu`:\n\n```text\nNavigationMenu\n├── NavigationMenuList\n│   ├── NavigationMenuItem\n│   │   ├── NavigationMenuTrigger\n│   │   └── NavigationMenuContent\n│   │       ├── NavigationMenuLink\n│   │       └── NavigationMenuLink\n│   └── NavigationMenuItem\n│       └── NavigationMenuLink\n└── NavigationMenuIndicator\n```',
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
        code: 'import {\n  NavigationMenu,\n  NavigationMenuItem,\n  NavigationMenuLink,\n  NavigationMenuList,\n} from "@erbium/ui/components/navigation-menu";\nexport default function Demo() {\n  return (\n    <NavigationMenu>\n      <NavigationMenuList>\n        <NavigationMenuItem>\n          <NavigationMenuLink href="/">Home</NavigationMenuLink>\n        </NavigationMenuItem>\n        <NavigationMenuItem>\n          <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>\n        </NavigationMenuItem>\n      </NavigationMenuList>\n    </NavigationMenu>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};
export const LinkComponent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use the `render` prop to compose a custom link component such as Next.js `Link`.\n\n```tsx\nimport Link from "next/link"\n\nimport {\n  NavigationMenuItem,\n  NavigationMenuLink,\n  navigationMenuTriggerStyle,\n} from "@erbium/ui/components/navigation-menu"\n\nexport function NavigationMenuDemo() {\n  return (\n    <NavigationMenuItem>\n      <NavigationMenuLink\n        render={<Link href="/docs" />}\n        className={navigationMenuTriggerStyle()}\n      >\n        Documentation\n      </NavigationMenuLink>\n    </NavigationMenuItem>\n  )\n}\n```',
      },
    },
  },

  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink render={<a href="#navigation-menu-link" />}>
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};
