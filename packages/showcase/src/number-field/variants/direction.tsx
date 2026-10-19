import { DirectionProvider } from "@erbium/ui/components/direction";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@erbium/ui/components/number-field";

const Example = () => (
  <DirectionProvider direction="rtl">
    <div dir="rtl" className="w-48">
      <NumberField defaultValue={98_765} locale="ar-EG">
        <NumberFieldGroup>
          <NumberFieldDecrement />
          <NumberFieldInput aria-label="الكمية" />
          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberField>
    </div>
  </DirectionProvider>
);

export default Example;
