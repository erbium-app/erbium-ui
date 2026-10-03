import { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";

export default function AlertColors() {
  return (
    <Alert variant="warning" className="max-w-md">
      <AlertTitle>Context window nearly full</AlertTitle>
      <AlertDescription>
        The agent may need to summarize this conversation before continuing the task.
      </AlertDescription>
    </Alert>
  );
}
