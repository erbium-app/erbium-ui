import { Button } from "@erbium/ui/components/button";

export default function ButtonVariantsExample() {
  return (
    <div className="flex flex-wrap gap-related">
      {(
        [
          "default",
          "secondary",
          "outline",
          "ghost",
          "error",
          "ghost-error",
          "ghost-success",
          "ghost-warning",
          "ghost-info",
          "link",
        ] as const
      ).map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  );
}
