import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from "@erbium/ui/components/select";

export const defaultProps = {
  align: "start",
  disabled: false,
  placeholder: "Select a fruit",
  side: "bottom",
  size: "default",
} satisfies {
  size: "default" | "sm";
  disabled: boolean;
  placeholder: string;
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
};

export default function SelectPlaygroundExample(
  args: {
    size: "default" | "sm";
    disabled: boolean;
    placeholder: string;
    side: "top" | "right" | "bottom" | "left";
    align: "start" | "center" | "end";
  } = defaultProps,
) {
  return (
    <Select>
      <SelectTrigger size={args.size} disabled={args.disabled} className="w-48">
        <SelectValue placeholder={args.placeholder} />
      </SelectTrigger>
      <SelectContent side={args.side} align={args.align}>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
  );
}
