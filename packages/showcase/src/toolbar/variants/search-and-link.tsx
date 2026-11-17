import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarLink,
  ToolbarSeparator,
} from "@erbium/ui/components/toolbar";

export default function ToolbarSearchAndLinkExample() {
  return (
    <Toolbar aria-label="Page tools">
      <ToolbarGroup aria-label="Navigation">
        <ToolbarButton>Refresh</ToolbarButton>
        <ToolbarLink href="https://base-ui.com/react/components/toolbar">Details</ToolbarLink>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarInput aria-label="Find on page" className="w-36" placeholder="Find on page" />
    </Toolbar>
  );
}
