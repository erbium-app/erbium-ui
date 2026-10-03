import { Badge } from "@erbium/ui/components/badge";

const Example = () => (
  <div className="flex gap-2">
    {(
      [
        "default",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "ghost-error",
        "ghost-success",
        "ghost-warning",
        "ghost-info",
        "tag-gray",
        "tag-red",
        "tag-orange",
        "tag-yellow",
        "tag-green",
        "tag-cyan",
        "tag-blue",
        "tag-purple",
        "tag-magenta",
        "outline",
      ] as const
    ).map((variant) => (
      <Badge key={variant} variant={variant}>
        {variant}
      </Badge>
    ))}
  </div>
);

export default Example;
