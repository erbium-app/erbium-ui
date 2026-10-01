import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@erbium/ui/components/dropdown-menu";
import { Button } from "@erbium/ui/components/button";
import { DropdownMenuBasic } from "../examples/upstream/dropdown-menu-basic";
import { DropdownMenuSubmenu } from "../examples/upstream/dropdown-menu-submenu";
import { DropdownMenuShortcuts } from "../examples/upstream/dropdown-menu-shortcuts";
import { DropdownMenuIcons } from "../examples/upstream/dropdown-menu-icons";
import { DropdownMenuCheckboxes } from "../examples/upstream/dropdown-menu-checkboxes";
import { DropdownMenuCheckboxesIcons } from "../examples/upstream/dropdown-menu-checkboxes-icons";
import { DropdownMenuRadioIcons } from "../examples/upstream/dropdown-menu-radio-icons";
import { DropdownMenuError } from "../examples/upstream/dropdown-menu-error";
import { DropdownMenuAvatar } from "../examples/upstream/dropdown-menu-avatar";
import { DropdownMenuComplex } from "../examples/upstream/dropdown-menu-complex";
import ExampleDropdownMenuRadioGroup from "../examples/dropdown-menu-radio-group";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import Demo from "../examples/dropdown-menu-demo";

const meta = {
  title: "UI/Dropdown Menu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'Displays a menu to the user — such as a set of actions or functions — triggered by a button.\n\n**Import:** `@erbium/ui/components/dropdown-menu`  \n\n**shadcn/ui page:** [Dropdown Menu](https://ui.shadcn.com/docs/components/base/dropdown-menu)\n\n### Usage\n\n```tsx\nimport { Button } from "@erbium/ui/components/button"\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuGroup,\n  DropdownMenuItem,\n  DropdownMenuLabel,\n  DropdownMenuSeparator,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu"\nimport {{ Button }} from "@erbium/ui/components/button"\n```\n\n```tsx\n<DropdownMenu>\n  <DropdownMenuTrigger render={<Button variant="outline" />}>\n    Open\n  </DropdownMenuTrigger>\n  <DropdownMenuContent>\n    <DropdownMenuGroup>\n      <DropdownMenuLabel>My Account</DropdownMenuLabel>\n      <DropdownMenuItem>Profile</DropdownMenuItem>\n      <DropdownMenuItem>Billing</DropdownMenuItem>\n    </DropdownMenuGroup>\n    <DropdownMenuSeparator />\n    <DropdownMenuGroup>\n      <DropdownMenuItem>Team</DropdownMenuItem>\n      <DropdownMenuItem>Subscription</DropdownMenuItem>\n    </DropdownMenuGroup>\n  </DropdownMenuContent>\n</DropdownMenu>\n```\n\n### Composition\n\nUse the following composition to build a `DropdownMenu`:\n\n```text\nDropdownMenu\n├── DropdownMenuTrigger\n└── DropdownMenuContent\n    ├── DropdownMenuGroup\n    │   ├── DropdownMenuLabel\n    │   ├── DropdownMenuItem\n    │   └── DropdownMenuItem\n    ├── DropdownMenuSeparator\n    ├── DropdownMenuGroup\n    │   ├── DropdownMenuLabel\n    │   ├── DropdownMenuCheckboxItem\n    │   └── DropdownMenuCheckboxItem\n    ├── DropdownMenuSeparator\n    ├── DropdownMenuGroup\n    │   ├── DropdownMenuLabel\n    │   └── DropdownMenuRadioGroup\n    │       ├── DropdownMenuRadioItem\n    │       └── DropdownMenuRadioItem\n    └── DropdownMenuSub\n        ├── DropdownMenuSubTrigger\n        └── DropdownMenuSubContent\n            └── DropdownMenuGroup\n                ├── DropdownMenuLabel\n                ├── DropdownMenuItem\n                └── DropdownMenuItem\n```',
      },
    },
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj;

export const Playground: StoryObj<{
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
  defaultOpen: boolean;
}> = {
  args: { side: "bottom", align: "start", defaultOpen: false },
  argTypes: {
    side: { control: "select", options: ["top", "right", "bottom", "left"] },
    align: { control: "select", options: ["start", "center", "end"] },
    defaultOpen: { control: "boolean" },
  },
  render: (args) => (
    <DropdownMenu key={String(args.defaultOpen)} defaultOpen={args.defaultOpen}>
      <DropdownMenuTrigger render={<Button variant="outline">Open menu</Button>} />
      <DropdownMenuContent side={args.side} align={args.align}>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const Overview: Story = {
  parameters: {
    docs: {
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuGroup,\n  DropdownMenuItem,\n  DropdownMenuLabel,\n  DropdownMenuPortal,\n  DropdownMenuSeparator,\n  DropdownMenuShortcut,\n  DropdownMenuSub,\n  DropdownMenuSubContent,\n  DropdownMenuSubTrigger,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu";\n\nexport default function DropdownMenuDemo() {\n  return (\n    <DropdownMenu>\n      <DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />\n      <DropdownMenuContent className="w-56" align="start">\n        <DropdownMenuGroup>\n          <DropdownMenuLabel>My Account</DropdownMenuLabel>\n          <DropdownMenuItem>\n            Profile\n            <DropdownMenuShortcut hotkey="Shift+Mod+P" />\n          </DropdownMenuItem>\n          <DropdownMenuItem>\n            Billing\n            <DropdownMenuShortcut hotkey="Mod+B" />\n          </DropdownMenuItem>\n          <DropdownMenuItem>\n            Settings\n            <DropdownMenuShortcut hotkey="Mod+S" />\n          </DropdownMenuItem>\n          <DropdownMenuItem>\n            Keyboard shortcuts\n            <DropdownMenuShortcut hotkey="Mod+K" />\n          </DropdownMenuItem>\n        </DropdownMenuGroup>\n        <DropdownMenuSeparator />\n        <DropdownMenuGroup>\n          <DropdownMenuItem>Team</DropdownMenuItem>\n          <DropdownMenuSub>\n            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>\n            <DropdownMenuPortal>\n              <DropdownMenuSubContent>\n                <DropdownMenuItem>Email</DropdownMenuItem>\n                <DropdownMenuItem>Message</DropdownMenuItem>\n                <DropdownMenuSeparator />\n                <DropdownMenuItem>More...</DropdownMenuItem>\n              </DropdownMenuSubContent>\n            </DropdownMenuPortal>\n          </DropdownMenuSub>\n          <DropdownMenuItem>\n            New Team\n            <DropdownMenuShortcut hotkey="Mod+PlusT" />\n          </DropdownMenuItem>\n        </DropdownMenuGroup>\n        <DropdownMenuSeparator />\n        <DropdownMenuItem>GitHub</DropdownMenuItem>\n        <DropdownMenuItem>Support</DropdownMenuItem>\n        <DropdownMenuItem disabled>API</DropdownMenuItem>\n        <DropdownMenuSeparator />\n        <DropdownMenuItem>\n          Log out\n          <DropdownMenuShortcut hotkey="Shift+Mod+Q" />\n        </DropdownMenuItem>\n      </DropdownMenuContent>\n    </DropdownMenu>\n  );\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <Demo />
    </div>
  ),
};

export const RadioGroup: Story = {
  parameters: {
    docs: {
      description: { story: "Use `DropdownMenuRadioGroup` for exclusive choices." },

      source: {
        code: '\nimport * as React from "react"\n\nimport { Button } from "@erbium/ui/components/button"\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuGroup,\n  DropdownMenuLabel,\n  DropdownMenuRadioGroup,\n  DropdownMenuRadioItem,\n  DropdownMenuSeparator,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu"\n\nexport default function DropdownMenuRadioGroupDemo() {\n  const [position, setPosition] = React.useState("bottom")\n\n  return (\n    <DropdownMenu>\n      <DropdownMenuTrigger render={<Button variant="outline">Open</Button>} />\n      <DropdownMenuContent className="w-56">\n        <DropdownMenuGroup>\n          <DropdownMenuLabel>Panel Position</DropdownMenuLabel>\n        </DropdownMenuGroup>\n        <DropdownMenuSeparator />\n        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>\n          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>\n          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>\n          <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>\n        </DropdownMenuRadioGroup>\n      </DropdownMenuContent>\n    </DropdownMenu>\n  )\n}\n',
      },
    },
  },
  render: () => (
    <div className="w-full min-w-72 max-w-2xl p-4">
      <ExampleDropdownMenuRadioGroup />
    </div>
  ),
};

export const Basic: Story = {
  parameters: {
    docs: {
      description: { story: "A basic dropdown menu with labels and separators." },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuGroup,\n  DropdownMenuItem,\n  DropdownMenuLabel,\n  DropdownMenuSeparator,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu";\n\nexport function DropdownMenuBasic() {\n  return (\n    <DropdownMenu>\n      <DropdownMenuTrigger render={<Button variant="outline" />}>Open</DropdownMenuTrigger>\n      <DropdownMenuContent>\n        <DropdownMenuGroup>\n          <DropdownMenuLabel>My Account</DropdownMenuLabel>\n          <DropdownMenuItem>Profile</DropdownMenuItem>\n          <DropdownMenuItem>Billing</DropdownMenuItem>\n          <DropdownMenuItem>Settings</DropdownMenuItem>\n        </DropdownMenuGroup>\n        <DropdownMenuSeparator />\n        <DropdownMenuItem>GitHub</DropdownMenuItem>\n        <DropdownMenuItem>Support</DropdownMenuItem>\n        <DropdownMenuItem disabled>API</DropdownMenuItem>\n      </DropdownMenuContent>\n    </DropdownMenu>\n  );\n}\n',
      },
    },
  },
  render: () => <DropdownMenuBasic />,
};
export const Submenu: Story = {
  parameters: {
    docs: {
      description: { story: "Use `DropdownMenuSub` to nest secondary actions." },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuGroup,\n  DropdownMenuItem,\n  DropdownMenuPortal,\n  DropdownMenuSeparator,\n  DropdownMenuShortcut,\n  DropdownMenuSub,\n  DropdownMenuSubContent,\n  DropdownMenuSubTrigger,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu";\n\nexport function DropdownMenuSubmenu() {\n  return (\n    <DropdownMenu>\n      <DropdownMenuTrigger render={<Button variant="outline" />}>Open</DropdownMenuTrigger>\n      <DropdownMenuContent>\n        <DropdownMenuGroup>\n          <DropdownMenuItem>Team</DropdownMenuItem>\n          <DropdownMenuSub>\n            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>\n            <DropdownMenuPortal>\n              <DropdownMenuSubContent>\n                <DropdownMenuItem>Email</DropdownMenuItem>\n                <DropdownMenuItem>Message</DropdownMenuItem>\n                <DropdownMenuSub>\n                  <DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>\n                  <DropdownMenuPortal>\n                    <DropdownMenuSubContent>\n                      <DropdownMenuItem>Calendly</DropdownMenuItem>\n                      <DropdownMenuItem>Slack</DropdownMenuItem>\n                      <DropdownMenuSeparator />\n                      <DropdownMenuItem>Webhook</DropdownMenuItem>\n                    </DropdownMenuSubContent>\n                  </DropdownMenuPortal>\n                </DropdownMenuSub>\n                <DropdownMenuSeparator />\n                <DropdownMenuItem>Advanced...</DropdownMenuItem>\n              </DropdownMenuSubContent>\n            </DropdownMenuPortal>\n          </DropdownMenuSub>\n          <DropdownMenuItem>\n            New Team\n            <DropdownMenuShortcut hotkey="Mod+PlusT" />\n          </DropdownMenuItem>\n        </DropdownMenuGroup>\n      </DropdownMenuContent>\n    </DropdownMenu>\n  );\n}\n',
      },
    },
  },
  render: () => <DropdownMenuSubmenu />,
};
export const Shortcuts: Story = {
  parameters: {
    docs: {
      description: { story: "Add `DropdownMenuShortcut` to show keyboard hints." },
      source: {
        code: 'import { Button } from "@erbium/ui/components/button";\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuGroup,\n  DropdownMenuItem,\n  DropdownMenuLabel,\n  DropdownMenuSeparator,\n  DropdownMenuShortcut,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu";\n\nexport function DropdownMenuShortcuts() {\n  return (\n    <DropdownMenu>\n      <DropdownMenuTrigger render={<Button variant="outline" />}>Open</DropdownMenuTrigger>\n      <DropdownMenuContent>\n        <DropdownMenuGroup>\n          <DropdownMenuLabel>My Account</DropdownMenuLabel>\n          <DropdownMenuItem>\n            Profile\n            <DropdownMenuShortcut hotkey="Shift+Mod+P" />\n          </DropdownMenuItem>\n          <DropdownMenuItem>\n            Billing\n            <DropdownMenuShortcut hotkey="Mod+B" />\n          </DropdownMenuItem>\n          <DropdownMenuItem>\n            Settings\n            <DropdownMenuShortcut hotkey="Mod+S" />\n          </DropdownMenuItem>\n        </DropdownMenuGroup>\n        <DropdownMenuSeparator />\n        <DropdownMenuItem>\n          Log out\n          <DropdownMenuShortcut hotkey="Shift+Mod+Q" />\n        </DropdownMenuItem>\n      </DropdownMenuContent>\n    </DropdownMenu>\n  );\n}\n',
      },
    },
  },
  render: () => <DropdownMenuShortcuts />,
};
export const Icons: Story = {
  parameters: {
    docs: {
      description: { story: "Combine icons with labels for quick scanning." },
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport CreditCardIcon from "@hugeicons/core-free-icons/CreditCardIcon";\nimport LogOutIcon from "@hugeicons/core-free-icons/LogOutIcon";\nimport Settings01Icon from "@hugeicons/core-free-icons/Settings01Icon";\nimport UserIcon from "@hugeicons/core-free-icons/UserIcon";\n\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuItem,\n  DropdownMenuSeparator,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu";\n\nexport function DropdownMenuIcons() {\n  return (\n    <DropdownMenu>\n      <DropdownMenuTrigger render={<Button variant="outline" />}>Open</DropdownMenuTrigger>\n      <DropdownMenuContent>\n        <DropdownMenuItem>\n          <HugeiconsIcon icon={UserIcon} />\n          Profile\n        </DropdownMenuItem>\n        <DropdownMenuItem>\n          <HugeiconsIcon icon={CreditCardIcon} />\n          Billing\n        </DropdownMenuItem>\n        <DropdownMenuItem>\n          <HugeiconsIcon icon={Settings01Icon} />\n          Settings\n        </DropdownMenuItem>\n        <DropdownMenuSeparator />\n        <DropdownMenuItem variant="error">\n          <HugeiconsIcon icon={LogOutIcon} />\n          Log out\n        </DropdownMenuItem>\n      </DropdownMenuContent>\n    </DropdownMenu>\n  );\n}\n',
      },
    },
  },
  render: () => <DropdownMenuIcons />,
};
export const Checkboxes: Story = {
  parameters: {
    docs: {
      description: { story: "Use `DropdownMenuCheckboxItem` for toggles." },
      source: {
        code: 'import * as React from "react";\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  DropdownMenu,\n  DropdownMenuCheckboxItem,\n  DropdownMenuContent,\n  DropdownMenuGroup,\n  DropdownMenuLabel,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu";\n\nexport function DropdownMenuCheckboxes() {\n  const [showStatusBar, setShowStatusBar] = React.useState(true);\n  const [showActivityBar, setShowActivityBar] = React.useState(false);\n  const [showPanel, setShowPanel] = React.useState(false);\n\n  return (\n    <DropdownMenu>\n      <DropdownMenuTrigger render={<Button variant="outline" />}>Open</DropdownMenuTrigger>\n      <DropdownMenuContent className="w-40">\n        <DropdownMenuGroup>\n          <DropdownMenuLabel>Appearance</DropdownMenuLabel>\n          <DropdownMenuCheckboxItem\n            checked={showStatusBar ?? false}\n            onCheckedChange={setShowStatusBar}\n          >\n            Status Bar\n          </DropdownMenuCheckboxItem>\n          <DropdownMenuCheckboxItem\n            checked={showActivityBar}\n            onCheckedChange={setShowActivityBar}\n            disabled\n          >\n            Activity Bar\n          </DropdownMenuCheckboxItem>\n          <DropdownMenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>\n            Panel\n          </DropdownMenuCheckboxItem>\n        </DropdownMenuGroup>\n      </DropdownMenuContent>\n    </DropdownMenu>\n  );\n}\n',
      },
    },
  },
  render: () => <DropdownMenuCheckboxes />,
};
export const CheckboxesIcons: Story = {
  parameters: {
    docs: {
      description: { story: "Add icons to checkbox items." },
      source: {
        code: 'import * as React from "react";\nimport { HugeiconsIcon } from "@hugeicons/react";\nimport BellIcon from "@hugeicons/core-free-icons/BellIcon";\nimport Mail01Icon from "@hugeicons/core-free-icons/Mail01Icon";\nimport MessageSquareIcon from "@hugeicons/core-free-icons/MessageSquareIcon";\n\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  DropdownMenu,\n  DropdownMenuCheckboxItem,\n  DropdownMenuContent,\n  DropdownMenuGroup,\n  DropdownMenuLabel,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu";\n\nexport function DropdownMenuCheckboxesIcons() {\n  const [notifications, setNotifications] = React.useState({\n    email: true,\n    sms: false,\n    push: true,\n  });\n\n  return (\n    <DropdownMenu>\n      <DropdownMenuTrigger render={<Button variant="outline" />}>Notifications</DropdownMenuTrigger>\n      <DropdownMenuContent className="w-48">\n        <DropdownMenuGroup>\n          <DropdownMenuLabel>Notification Preferences</DropdownMenuLabel>\n          <DropdownMenuCheckboxItem\n            checked={notifications.email}\n            onCheckedChange={(checked) =>\n              setNotifications({ ...notifications, email: checked === true })\n            }\n          >\n            <HugeiconsIcon icon={Mail01Icon} />\n            Email notifications\n          </DropdownMenuCheckboxItem>\n          <DropdownMenuCheckboxItem\n            checked={notifications.sms}\n            onCheckedChange={(checked) =>\n              setNotifications({ ...notifications, sms: checked === true })\n            }\n          >\n            <HugeiconsIcon icon={MessageSquareIcon} />\n            SMS notifications\n          </DropdownMenuCheckboxItem>\n          <DropdownMenuCheckboxItem\n            checked={notifications.push}\n            onCheckedChange={(checked) =>\n              setNotifications({ ...notifications, push: checked === true })\n            }\n          >\n            <HugeiconsIcon icon={BellIcon} />\n            Push notifications\n          </DropdownMenuCheckboxItem>\n        </DropdownMenuGroup>\n      </DropdownMenuContent>\n    </DropdownMenu>\n  );\n}\n',
      },
    },
  },
  render: () => <DropdownMenuCheckboxesIcons />,
};
export const RadioIcons: Story = {
  parameters: {
    docs: {
      description: { story: "Show radio options with icons." },
      source: {
        code: 'import * as React from "react";\nimport { HugeiconsIcon } from "@hugeicons/react";\nimport Building02Icon from "@hugeicons/core-free-icons/Building02Icon";\nimport CreditCardIcon from "@hugeicons/core-free-icons/CreditCardIcon";\nimport Wallet01Icon from "@hugeicons/core-free-icons/Wallet01Icon";\n\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuGroup,\n  DropdownMenuLabel,\n  DropdownMenuRadioGroup,\n  DropdownMenuRadioItem,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu";\n\nexport function DropdownMenuRadioIcons() {\n  const [paymentMethod, setPaymentMethod] = React.useState("card");\n\n  return (\n    <DropdownMenu>\n      <DropdownMenuTrigger render={<Button variant="outline" />}>\n        Payment Method\n      </DropdownMenuTrigger>\n      <DropdownMenuContent className="min-w-56">\n        <DropdownMenuGroup>\n          <DropdownMenuLabel>Select Payment Method</DropdownMenuLabel>\n          <DropdownMenuRadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>\n            <DropdownMenuRadioItem value="card">\n              <HugeiconsIcon icon={CreditCardIcon} />\n              Credit Card\n            </DropdownMenuRadioItem>\n            <DropdownMenuRadioItem value="paypal">\n              <HugeiconsIcon icon={Wallet01Icon} />\n              PayPal\n            </DropdownMenuRadioItem>\n            <DropdownMenuRadioItem value="bank">\n              <HugeiconsIcon icon={Building02Icon} />\n              Bank Transfer\n            </DropdownMenuRadioItem>\n          </DropdownMenuRadioGroup>\n        </DropdownMenuGroup>\n      </DropdownMenuContent>\n    </DropdownMenu>\n  );\n}\n',
      },
    },
  },
  render: () => <DropdownMenuRadioIcons />,
};
export const ErrorVariant: Story = {
  name: "Error",
  parameters: {
    docs: {
      description: { story: 'Use `variant="error"` for irreversible actions.' },
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport PencilIcon from "@hugeicons/core-free-icons/PencilIcon";\nimport Share01Icon from "@hugeicons/core-free-icons/Share01Icon";\nimport TrashIcon from "@hugeicons/core-free-icons/TrashIcon";\n\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuGroup,\n  DropdownMenuItem,\n  DropdownMenuSeparator,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu";\n\nexport function DropdownMenuError() {\n  return (\n    <DropdownMenu>\n      <DropdownMenuTrigger render={<Button variant="outline" />}>Actions</DropdownMenuTrigger>\n      <DropdownMenuContent>\n        <DropdownMenuGroup>\n          <DropdownMenuItem>\n            <HugeiconsIcon icon={PencilIcon} />\n            Edit\n          </DropdownMenuItem>\n          <DropdownMenuItem>\n            <HugeiconsIcon icon={Share01Icon} />\n            Share\n          </DropdownMenuItem>\n        </DropdownMenuGroup>\n        <DropdownMenuSeparator />\n        <DropdownMenuGroup>\n          <DropdownMenuItem variant="error">\n            <HugeiconsIcon icon={TrashIcon} />\n            Delete\n          </DropdownMenuItem>\n        </DropdownMenuGroup>\n      </DropdownMenuContent>\n    </DropdownMenu>\n  );\n}\n',
      },
    },
  },
  render: () => <DropdownMenuError />,
};
export const Avatar: Story = {
  parameters: {
    docs: {
      description: { story: "An account switcher dropdown triggered by an avatar." },
      source: {
        code: 'import { HugeiconsIcon } from "@hugeicons/react";\nimport BadgeCheckIcon from "@hugeicons/core-free-icons/BadgeCheckIcon";\nimport BellIcon from "@hugeicons/core-free-icons/BellIcon";\nimport CreditCardIcon from "@hugeicons/core-free-icons/CreditCardIcon";\nimport LogOutIcon from "@hugeicons/core-free-icons/LogOutIcon";\n\n\nimport { Avatar, AvatarFallback, AvatarImage } from "@erbium/ui/components/avatar";\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  DropdownMenu,\n  DropdownMenuContent,\n  DropdownMenuGroup,\n  DropdownMenuItem,\n  DropdownMenuSeparator,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu";\n\nexport function DropdownMenuAvatar() {\n  return (\n    <DropdownMenu>\n      <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-[35%]" />}>\n        <Avatar>\n          <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />\n          <AvatarFallback>LR</AvatarFallback>\n        </Avatar>\n      </DropdownMenuTrigger>\n      <DropdownMenuContent align="end">\n        <DropdownMenuGroup>\n          <DropdownMenuItem>\n            <HugeiconsIcon icon={BadgeCheckIcon} />\n            Account\n          </DropdownMenuItem>\n          <DropdownMenuItem>\n            <HugeiconsIcon icon={CreditCardIcon} />\n            Billing\n          </DropdownMenuItem>\n          <DropdownMenuItem>\n            <HugeiconsIcon icon={BellIcon} />\n            Notifications\n          </DropdownMenuItem>\n        </DropdownMenuGroup>\n        <DropdownMenuSeparator />\n        <DropdownMenuItem>\n          <HugeiconsIcon icon={LogOutIcon} />\n          Sign Out\n        </DropdownMenuItem>\n      </DropdownMenuContent>\n    </DropdownMenu>\n  );\n}\n',
      },
    },
  },
  render: () => <DropdownMenuAvatar />,
};
export const Complex: Story = {
  parameters: {
    docs: {
      description: { story: "A richer example combining groups, icons, and submenus." },
      source: {
        code: 'import * as React from "react";\nimport { HugeiconsIcon } from "@hugeicons/react";\nimport BellIcon from "@hugeicons/core-free-icons/BellIcon";\nimport CreditCardIcon from "@hugeicons/core-free-icons/CreditCardIcon";\nimport Download01Icon from "@hugeicons/core-free-icons/Download01Icon";\nimport EyeIcon from "@hugeicons/core-free-icons/EyeIcon";\nimport File01Icon from "@hugeicons/core-free-icons/File01Icon";\nimport FileCodeIcon from "@hugeicons/core-free-icons/FileCodeIcon";\nimport FileTextIcon from "@hugeicons/core-free-icons/FileTextIcon";\nimport Folder01Icon from "@hugeicons/core-free-icons/Folder01Icon";\nimport FolderOpenIcon from "@hugeicons/core-free-icons/FolderOpenIcon";\nimport FolderSearchIcon from "@hugeicons/core-free-icons/FolderSearchIcon";\nimport HelpCircleIcon from "@hugeicons/core-free-icons/HelpCircleIcon";\nimport KeyboardIcon from "@hugeicons/core-free-icons/KeyboardIcon";\nimport LanguagesIcon from "@hugeicons/core-free-icons/LanguagesIcon";\nimport Layout01Icon from "@hugeicons/core-free-icons/Layout01Icon";\nimport LogOutIcon from "@hugeicons/core-free-icons/LogOutIcon";\nimport Mail01Icon from "@hugeicons/core-free-icons/Mail01Icon";\nimport MonitorIcon from "@hugeicons/core-free-icons/MonitorIcon";\nimport MoonIcon from "@hugeicons/core-free-icons/MoonIcon";\nimport MoreHorizontalIcon from "@hugeicons/core-free-icons/MoreHorizontalIcon";\nimport PaletteIcon from "@hugeicons/core-free-icons/PaletteIcon";\nimport SaveIcon from "@hugeicons/core-free-icons/SaveIcon";\nimport Settings01Icon from "@hugeicons/core-free-icons/Settings01Icon";\nimport Shield01Icon from "@hugeicons/core-free-icons/Shield01Icon";\nimport Sun01Icon from "@hugeicons/core-free-icons/Sun01Icon";\nimport UserIcon from "@hugeicons/core-free-icons/UserIcon";\n\n\nimport { Button } from "@erbium/ui/components/button";\nimport {\n  DropdownMenu,\n  DropdownMenuCheckboxItem,\n  DropdownMenuContent,\n  DropdownMenuGroup,\n  DropdownMenuItem,\n  DropdownMenuLabel,\n  DropdownMenuPortal,\n  DropdownMenuRadioGroup,\n  DropdownMenuRadioItem,\n  DropdownMenuSeparator,\n  DropdownMenuShortcut,\n  DropdownMenuSub,\n  DropdownMenuSubContent,\n  DropdownMenuSubTrigger,\n  DropdownMenuTrigger,\n} from "@erbium/ui/components/dropdown-menu";\n\nexport function DropdownMenuComplex() {\n  const [notifications, setNotifications] = React.useState({\n    email: true,\n    sms: false,\n    push: true,\n  });\n  const [theme, setTheme] = React.useState("light");\n\n  return (\n    <DropdownMenu>\n      <DropdownMenuTrigger render={<Button variant="outline" />}>Complex Menu</DropdownMenuTrigger>\n      <DropdownMenuContent className="w-44">\n        <DropdownMenuGroup>\n          <DropdownMenuLabel>File</DropdownMenuLabel>\n          <DropdownMenuItem>\n            <HugeiconsIcon icon={File01Icon} />\n            New File\n            <DropdownMenuShortcut hotkey="Mod+N" />\n          </DropdownMenuItem>\n          <DropdownMenuItem>\n            <HugeiconsIcon icon={Folder01Icon} />\n            New Folder\n            <DropdownMenuShortcut hotkey="Shift+Mod+N" />\n          </DropdownMenuItem>\n          <DropdownMenuSub>\n            <DropdownMenuSubTrigger>\n              <HugeiconsIcon icon={FolderOpenIcon} />\n              Open Recent\n            </DropdownMenuSubTrigger>\n            <DropdownMenuPortal>\n              <DropdownMenuSubContent>\n                <DropdownMenuGroup>\n                  <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>\n                  <DropdownMenuItem>\n                    <HugeiconsIcon icon={FileCodeIcon} />\n                    Project Alpha\n                  </DropdownMenuItem>\n                  <DropdownMenuItem>\n                    <HugeiconsIcon icon={FileCodeIcon} />\n                    Project Beta\n                  </DropdownMenuItem>\n                  <DropdownMenuSub>\n                    <DropdownMenuSubTrigger>\n                      <HugeiconsIcon icon={MoreHorizontalIcon} />\n                      More Projects\n                    </DropdownMenuSubTrigger>\n                    <DropdownMenuPortal>\n                      <DropdownMenuSubContent>\n                        <DropdownMenuItem>\n                          <HugeiconsIcon icon={FileCodeIcon} />\n                          Project Gamma\n                        </DropdownMenuItem>\n                        <DropdownMenuItem>\n                          <HugeiconsIcon icon={FileCodeIcon} />\n                          Project Delta\n                        </DropdownMenuItem>\n                      </DropdownMenuSubContent>\n                    </DropdownMenuPortal>\n                  </DropdownMenuSub>\n                </DropdownMenuGroup>\n                <DropdownMenuSeparator />\n                <DropdownMenuGroup>\n                  <DropdownMenuItem>\n                    <HugeiconsIcon icon={FolderSearchIcon} />\n                    Browse...\n                  </DropdownMenuItem>\n                </DropdownMenuGroup>\n              </DropdownMenuSubContent>\n            </DropdownMenuPortal>\n          </DropdownMenuSub>\n          <DropdownMenuSeparator />\n          <DropdownMenuItem>\n            <HugeiconsIcon icon={SaveIcon} />\n            Save\n            <DropdownMenuShortcut hotkey="Mod+S" />\n          </DropdownMenuItem>\n          <DropdownMenuItem>\n            <HugeiconsIcon icon={Download01Icon} />\n            Export\n            <DropdownMenuShortcut hotkey="Shift+Mod+E" />\n          </DropdownMenuItem>\n        </DropdownMenuGroup>\n        <DropdownMenuSeparator />\n        <DropdownMenuGroup>\n          <DropdownMenuLabel>View</DropdownMenuLabel>\n          <DropdownMenuCheckboxItem\n            checked={notifications.email}\n            onCheckedChange={(checked) =>\n              setNotifications({ ...notifications, email: checked === true })\n            }\n          >\n            <HugeiconsIcon icon={EyeIcon} />\n            Show Sidebar\n          </DropdownMenuCheckboxItem>\n          <DropdownMenuCheckboxItem\n            checked={notifications.sms}\n            onCheckedChange={(checked) =>\n              setNotifications({ ...notifications, sms: checked === true })\n            }\n          >\n            <HugeiconsIcon icon={Layout01Icon} />\n            Show Status Bar\n          </DropdownMenuCheckboxItem>\n          <DropdownMenuSub>\n            <DropdownMenuSubTrigger>\n              <HugeiconsIcon icon={PaletteIcon} />\n              Theme\n            </DropdownMenuSubTrigger>\n            <DropdownMenuPortal>\n              <DropdownMenuSubContent>\n                <DropdownMenuGroup>\n                  <DropdownMenuLabel>Appearance</DropdownMenuLabel>\n                  <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>\n                    <DropdownMenuRadioItem value="light">\n                      <HugeiconsIcon icon={Sun01Icon} />\n                      Light\n                    </DropdownMenuRadioItem>\n                    <DropdownMenuRadioItem value="dark">\n                      <HugeiconsIcon icon={MoonIcon} />\n                      Dark\n                    </DropdownMenuRadioItem>\n                    <DropdownMenuRadioItem value="system">\n                      <HugeiconsIcon icon={MonitorIcon} />\n                      System\n                    </DropdownMenuRadioItem>\n                  </DropdownMenuRadioGroup>\n                </DropdownMenuGroup>\n              </DropdownMenuSubContent>\n            </DropdownMenuPortal>\n          </DropdownMenuSub>\n        </DropdownMenuGroup>\n        <DropdownMenuSeparator />\n        <DropdownMenuGroup>\n          <DropdownMenuLabel>Account</DropdownMenuLabel>\n          <DropdownMenuItem>\n            <HugeiconsIcon icon={UserIcon} />\n            Profile\n            <DropdownMenuShortcut hotkey="Shift+Mod+P" />\n          </DropdownMenuItem>\n          <DropdownMenuItem>\n            <HugeiconsIcon icon={CreditCardIcon} />\n            Billing\n          </DropdownMenuItem>\n          <DropdownMenuSub>\n            <DropdownMenuSubTrigger>\n              <HugeiconsIcon icon={Settings01Icon} />\n              Settings\n            </DropdownMenuSubTrigger>\n            <DropdownMenuPortal>\n              <DropdownMenuSubContent>\n                <DropdownMenuGroup>\n                  <DropdownMenuLabel>Preferences</DropdownMenuLabel>\n                  <DropdownMenuItem>\n                    <HugeiconsIcon icon={KeyboardIcon} />\n                    Keyboard Shortcuts\n                  </DropdownMenuItem>\n                  <DropdownMenuItem>\n                    <HugeiconsIcon icon={LanguagesIcon} />\n                    Language\n                  </DropdownMenuItem>\n                  <DropdownMenuSub>\n                    <DropdownMenuSubTrigger>\n                      <HugeiconsIcon icon={BellIcon} />\n                      Notifications\n                    </DropdownMenuSubTrigger>\n                    <DropdownMenuPortal>\n                      <DropdownMenuSubContent>\n                        <DropdownMenuGroup>\n                          <DropdownMenuLabel>Notification Types</DropdownMenuLabel>\n                          <DropdownMenuCheckboxItem\n                            checked={notifications.push}\n                            onCheckedChange={(checked) =>\n                              setNotifications({\n                                ...notifications,\n                                push: checked === true,\n                              })\n                            }\n                          >\n                            <HugeiconsIcon icon={BellIcon} />\n                            Push Notifications\n                          </DropdownMenuCheckboxItem>\n                          <DropdownMenuCheckboxItem\n                            checked={notifications.email}\n                            onCheckedChange={(checked) =>\n                              setNotifications({\n                                ...notifications,\n                                email: checked === true,\n                              })\n                            }\n                          >\n                            <HugeiconsIcon icon={Mail01Icon} />\n                            Email Notifications\n                          </DropdownMenuCheckboxItem>\n                        </DropdownMenuGroup>\n                      </DropdownMenuSubContent>\n                    </DropdownMenuPortal>\n                  </DropdownMenuSub>\n                </DropdownMenuGroup>\n                <DropdownMenuSeparator />\n                <DropdownMenuGroup>\n                  <DropdownMenuItem>\n                    <HugeiconsIcon icon={Shield01Icon} />\n                    Privacy & Security\n                  </DropdownMenuItem>\n                </DropdownMenuGroup>\n              </DropdownMenuSubContent>\n            </DropdownMenuPortal>\n          </DropdownMenuSub>\n        </DropdownMenuGroup>\n        <DropdownMenuSeparator />\n        <DropdownMenuGroup>\n          <DropdownMenuItem>\n            <HugeiconsIcon icon={HelpCircleIcon} />\n            Help & Support\n          </DropdownMenuItem>\n          <DropdownMenuItem>\n            <HugeiconsIcon icon={FileTextIcon} />\n            Documentation\n          </DropdownMenuItem>\n        </DropdownMenuGroup>\n        <DropdownMenuSeparator />\n        <DropdownMenuGroup>\n          <DropdownMenuItem variant="error">\n            <HugeiconsIcon icon={LogOutIcon} />\n            Sign Out\n            <DropdownMenuShortcut hotkey="Shift+Mod+Q" />\n          </DropdownMenuItem>\n        </DropdownMenuGroup>\n      </DropdownMenuContent>\n    </DropdownMenu>\n  );\n}\n',
      },
    },
  },
  render: () => <DropdownMenuComplex />,
};
