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
  ToolbarSeparator,
} from "@erbium/ui/components/toolbar";

const Example = () => (
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
);

export default Example;
