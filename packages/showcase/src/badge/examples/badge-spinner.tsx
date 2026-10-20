import { Badge } from "@erbium/ui/components/badge";
import { Spinner } from "@erbium/ui/components/spinner";

export const BadgeWithSpinner = () => (
  <div className="flex flex-wrap gap-related">
    <Badge variant="error">
      <Spinner data-icon="inline-start" />
      Deleting
    </Badge>
    <Badge variant="secondary">
      Generating
      <Spinner data-icon="inline-end" />
    </Badge>
  </div>
);
