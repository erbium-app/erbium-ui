import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { SegmentedControl, SegmentedControlItem } from "@erbium/ui/components/segmented-control";

export default function SegmentedControlFilterExample() {
  return (
    <SegmentedControl render={<ToggleGroup aria-label="Issue status" defaultValue={["open"]} />}>
      <SegmentedControlItem render={<Toggle value="open" />}>Open</SegmentedControlItem>
      <SegmentedControlItem render={<Toggle value="closed" />}>Closed</SegmentedControlItem>
      <SegmentedControlItem render={<Toggle value="draft" />}>Draft</SegmentedControlItem>
    </SegmentedControl>
  );
}
