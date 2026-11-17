import { Alert, AlertAction, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";
import { Button } from "@erbium/ui/components/button";

export default function AlertActionExample() {
  return (
    <Alert variant="warning" className="w-96">
      <AlertTitle>Approval required</AlertTitle>
      <AlertDescription>The agent needs permission to install a new dependency.</AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline">
          Review
        </Button>
      </AlertAction>
    </Alert>
  );
}
