import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@erbium/ui/components/select";

const options = [
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "research", label: "Research" },
];
const initialValues: readonly string[] = ["design"];

export default function ReadonlySelectionExample() {
  const [value, setValue] = useState<readonly string[]>(initialValues);
  return (
    <div className="grid gap-related">
      <Select multiple items={options} value={value} onValueChange={setValue}>
        <SelectTrigger aria-label="Project teams" className="w-64">
          <SelectValue placeholder="Choose teams" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p role="status" className="text-caption text-muted-foreground">
        Selected teams: {value.join(", ") || "none"}
      </p>
    </div>
  );
}
