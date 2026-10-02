import {
  FieldDescription,
  FieldItem,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@erbium/ui/components/field";
import { RadioGroup, RadioGroupItem } from "@erbium/ui/components/radio-group";

export default function FieldRadio() {
  return (
    <div className="w-full max-w-md">
      <FieldSet>
        <FieldLegend variant="label">Subscription Plan</FieldLegend>
        <FieldDescription>Yearly and lifetime plans offer significant savings.</FieldDescription>
        <RadioGroup defaultValue="monthly">
          <FieldItem orientation="horizontal">
            <RadioGroupItem value="monthly" />
            <FieldLabel className="font-normal">Monthly ($9.99/month)</FieldLabel>
          </FieldItem>
          <FieldItem orientation="horizontal">
            <RadioGroupItem value="yearly" />
            <FieldLabel className="font-normal">Yearly ($99.99/year)</FieldLabel>
          </FieldItem>
          <FieldItem orientation="horizontal">
            <RadioGroupItem value="lifetime" />
            <FieldLabel className="font-normal">Lifetime ($299.99)</FieldLabel>
          </FieldItem>
        </RadioGroup>
      </FieldSet>
    </div>
  );
}
