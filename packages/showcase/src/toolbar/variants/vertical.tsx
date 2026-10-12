import { Icon } from "@erbium/ui/components/icon";
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from "@erbium/ui/components/toolbar";

const Example = () => (
  <Toolbar aria-label="Text formatting" orientation="vertical">
    <ToolbarGroup aria-label="Text style">
      <ToolbarButton aria-label="Bold" size="icon-sm">
        <Icon name="bold" />
      </ToolbarButton>
      <ToolbarButton aria-label="Italic" size="icon-sm">
        <Icon name="italic" />
      </ToolbarButton>
    </ToolbarGroup>
    <ToolbarSeparator />
    <ToolbarButton aria-label="Insert link" size="icon-sm">
      <Icon name="link-01" />
    </ToolbarButton>
  </Toolbar>
);

export default Example;
