import { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";

const AlertColors = () => (
  <Alert variant="warning" className="max-w-md">
    <AlertTitle>Context window nearly full</AlertTitle>
    <AlertDescription>
      The agent may need to summarize this conversation before continuing the task.
    </AlertDescription>
  </Alert>
);

export default AlertColors;
