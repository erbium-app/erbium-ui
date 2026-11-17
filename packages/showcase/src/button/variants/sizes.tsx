import { Button } from "@erbium/ui/components/button";

export default function ButtonSizesExample() {
  return (
    <div className="flex items-center gap-related">
      {(["xs", "sm", "default", "lg"] as const).map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  );
}
