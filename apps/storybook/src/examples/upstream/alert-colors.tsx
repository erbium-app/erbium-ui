import { HugeiconsIcon } from "@hugeicons/react";
import Alert01Icon from "@hugeicons/core-free-icons/Alert01Icon";

import { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";

export default function AlertColors() {
  return (
    <Alert variant="warning" className="max-w-md">
      <HugeiconsIcon icon={Alert01Icon} />
      <AlertTitle>Your subscription will expire in 3 days.</AlertTitle>
      <AlertDescription>
        Renew now to avoid service interruption or upgrade to a paid plan to continue using the
        service.
      </AlertDescription>
    </Alert>
  );
}
