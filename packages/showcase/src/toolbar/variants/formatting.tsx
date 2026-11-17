import { Icon } from "@erbium/ui/components/icon";
import { Toggle } from "@erbium/ui/components/toggle";
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from "@erbium/ui/components/toolbar";

export default function ToolbarFormattingExample() {
  return (
    <Toolbar aria-label="Text formatting">
      <ToolbarGroup aria-label="Text style">
        <ToolbarButton render={<Toggle aria-label="Bold" />} size="icon-sm">
          <Icon name="bold" />
        </ToolbarButton>
        <ToolbarButton render={<Toggle aria-label="Italic" />} size="icon-sm">
          <Icon name="italic" />
        </ToolbarButton>
        <ToolbarButton render={<Toggle aria-label="Underline" />} size="icon-sm">
          <Icon name="underline" />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarButton aria-label="Insert link" size="icon-sm">
        <Icon name="link-01" />
      </ToolbarButton>
    </Toolbar>
  );
}
