import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
} from "@erbium/ui/components/toolbar";

export default function ToolbarDisabledExample() {
  return (
    <Toolbar aria-label="Editing commands">
      <ToolbarButton>Undo</ToolbarButton>
      <ToolbarButton disabled>Redo</ToolbarButton>
      <ToolbarSeparator />
      <ToolbarGroup aria-label="Clipboard" disabled>
        <ToolbarButton>Cut</ToolbarButton>
        <ToolbarButton>Paste</ToolbarButton>
      </ToolbarGroup>
    </Toolbar>
  );
}
