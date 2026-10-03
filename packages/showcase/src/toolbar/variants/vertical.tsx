import BoldIcon from "@hugeicons/core-free-icons/BoldIcon";
import ItalicIcon from "@hugeicons/core-free-icons/ItalicIcon";
import Link01Icon from "@hugeicons/core-free-icons/Link01Icon";
import { HugeiconsIcon } from "@hugeicons/react";
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
);

export default Example;
