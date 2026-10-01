import BoldIcon from "@hugeicons/core-free-icons/BoldIcon";
import ItalicIcon from "@hugeicons/core-free-icons/ItalicIcon";
import Link01Icon from "@hugeicons/core-free-icons/Link01Icon";
import UnderlineIcon from "@hugeicons/core-free-icons/UnderlineIcon";
import { HugeiconsIcon } from "@hugeicons/react";
import { Toggle } from "@erbium/ui/components/toggle";
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarSeparator,
} from "@erbium/ui/components/toolbar";
import type { Meta, StoryObj } from "@storybook/tanstack-react";

const meta = {
  title: "UI/Toolbar",
  component: Toolbar,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A labeled command bar with arrow-key navigation. `ToolbarButton` and `ToolbarLink` use the shared button styles; compose toggles or popup triggers with the button’s `render` prop. In a horizontal toolbar, put an input last so arrow keys still work for text editing.\n\n**Import:** `@erbium/ui/components/toolbar`",
      },
    },
  },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Formatting: Story = {
  render: () => (
    <Toolbar aria-label="Text formatting">
      <ToolbarGroup aria-label="Text style">
        <ToolbarButton render={<Toggle aria-label="Bold" />} size="icon-sm">
          <HugeiconsIcon icon={BoldIcon} />
        </ToolbarButton>
        <ToolbarButton render={<Toggle aria-label="Italic" />} size="icon-sm">
          <HugeiconsIcon icon={ItalicIcon} />
        </ToolbarButton>
        <ToolbarButton render={<Toggle aria-label="Underline" />} size="icon-sm">
          <HugeiconsIcon icon={UnderlineIcon} />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Insert link" size="icon-sm">
        <HugeiconsIcon icon={Link01Icon} />
      </ToolbarButton>
    </Toolbar>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Toolbar aria-label="Text formatting" orientation="vertical">
      <ToolbarGroup aria-label="Text style">
        <ToolbarButton aria-label="Bold" size="icon-sm">
          <HugeiconsIcon icon={BoldIcon} />
        </ToolbarButton>
        <ToolbarButton aria-label="Italic" size="icon-sm">
          <HugeiconsIcon icon={ItalicIcon} />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Insert link" size="icon-sm">
        <HugeiconsIcon icon={Link01Icon} />
      </ToolbarButton>
    </Toolbar>
  ),
};

export const SearchAndLink: Story = {
  render: () => (
    <Toolbar aria-label="Page tools">
      <ToolbarGroup aria-label="Navigation">
        <ToolbarButton>Refresh</ToolbarButton>
        <ToolbarLink href="https://base-ui.com/react/components/toolbar">Details</ToolbarLink>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarInput aria-label="Find on page" className="w-36" placeholder="Find on page" />
    </Toolbar>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Toolbar aria-label="Editing commands">
      <ToolbarButton>Undo</ToolbarButton>
      <ToolbarButton disabled>Redo</ToolbarButton>
      <ToolbarSeparator />
      <ToolbarGroup aria-label="Clipboard" disabled>
        <ToolbarButton>Cut</ToolbarButton>
        <ToolbarButton>Paste</ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  ),
};
