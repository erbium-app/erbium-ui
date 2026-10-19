import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from "@erbium/ui/components/select";

const Example = (args: {
  size: "default" | "sm";
  disabled: boolean;
  placeholder: string;
  side: "top" | "right" | "bottom" | "left";
  align: "start" | "center" | "end";
}) => (
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

export default Example;
