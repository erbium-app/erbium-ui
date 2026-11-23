import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { SegmentedControl, SegmentedControlItem } from "@erbium/ui/components/segmented-control";

export default function SegmentedControlDemoExample() {
  return (
    <SegmentedControl aria-label="Billing period" render={<RadioGroup defaultValue="monthly" />}>
      <SegmentedControlItem render={<Radio.Root value="monthly" />}>Monthly</SegmentedControlItem>
      <SegmentedControlItem render={<Radio.Root value="yearly" />}>Yearly</SegmentedControlItem>
      <SegmentedControlItem render={<Radio.Root value="lifetime" />}>Lifetime</SegmentedControlItem>
    </SegmentedControl>
  );
}
