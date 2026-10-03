import { Button } from "@erbium/ui/components/button";

const Example = () => (
  <div className="flex items-center gap-2">
    {(["xs", "sm", "default", "lg"] as const).map((size) => (
      <Button key={size} size={size}>
        {size}
      </Button>
    ))}
  </div>
);

export default Example;
