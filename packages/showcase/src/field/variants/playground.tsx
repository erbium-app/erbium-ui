import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@erbium/ui/components/field";
import { Input as UIInput } from "@erbium/ui/components/input";

export const defaultProps = {
  className: "",
  error: "Enter a valid email.",
  invalid: false,
  legendVariant: "legend",
  orientation: "vertical",
} satisfies {
  orientation: "vertical" | "horizontal" | "responsive";
  invalid: boolean;
  error: string;
  className: string;
  legendVariant: "legend" | "label";
};

export default function FieldPlaygroundExample(
  args: {
    orientation: "vertical" | "horizontal" | "responsive";
    invalid: boolean;
    error: string;
    className: string;
    legendVariant: "legend" | "label";
  } = defaultProps,
) {
  return (
    <FieldSet>
      <FieldLegend variant={args.legendVariant}>Contact details</FieldLegend>
      <Field
        orientation={args.orientation}
        invalid={args.invalid}
        className={`w-80 ${args.className}`}
      >
        <FieldLabel htmlFor="playground-field">Email</FieldLabel>
        <UIInput id="playground-field" placeholder="name@example.com" />
        <FieldDescription>We will use this to contact you.</FieldDescription>
        <FieldError errors={args.invalid ? [args.error] : []} />
      </Field>
    </FieldSet>
  );
}
