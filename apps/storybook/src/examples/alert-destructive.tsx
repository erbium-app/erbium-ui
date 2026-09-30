import { HugeiconsIcon } from "@hugeicons/react";
import AlertCircleIcon from "@hugeicons/core-free-icons/AlertCircleIcon";

import { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";

export default function AlertDestructive() {
  return (
    <Alert variant="destructive">
      <HugeiconsIcon icon={AlertCircleIcon} />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
    </Alert>
  );
}
