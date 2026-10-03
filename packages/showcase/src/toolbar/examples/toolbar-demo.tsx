import { Toolbar, ToolbarButton, ToolbarGroup } from "@erbium/ui/components/toolbar";
import { Toggle } from "@erbium/ui/components/toggle";
export default function Demo() {
  return (
    <Toolbar aria-label="Text formatting">
      <ToolbarGroup aria-label="Text style">
        <ToolbarButton render={<Toggle aria-label="Bold" />}>Bold</ToolbarButton>
        <ToolbarButton render={<Toggle aria-label="Italic" />}>Italic</ToolbarButton>
        <ToolbarButton render={<Toggle aria-label="Underline" />}>Underline</ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  );
}
