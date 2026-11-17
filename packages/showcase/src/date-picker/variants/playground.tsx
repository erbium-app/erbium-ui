import {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerInput,
} from "@erbium/ui/components/date-picker";

export const defaultProps = {
  captionLayout: "label",
  closeOnSelect: true,
  disabled: false,
  mode: "single",
  numberOfMonths: 1,
} satisfies {
  mode: "single" | "range";
  disabled: boolean;
  closeOnSelect: boolean;
  numberOfMonths: number;
  captionLayout: "label" | "dropdown";
};

export default function DatePickerPlaygroundExample(
  args: {
    mode: "single" | "range";
    disabled: boolean;
    closeOnSelect: boolean;
    numberOfMonths: number;
    captionLayout: "label" | "dropdown";
  } = defaultProps,
) {
  return (
    <DatePicker
      // Remount when the mode changes so each mode starts from an empty value.
      key={args.mode}
      mode={args.mode}
      disabled={args.disabled}
      closeOnSelect={args.closeOnSelect}
    >
      <DatePickerInput aria-label="Date" className="w-72" />
      <DatePickerContent>
        <DatePickerCalendar
          numberOfMonths={args.numberOfMonths}
          captionLayout={args.captionLayout}
        />
      </DatePickerContent>
    </DatePicker>
  );
}
