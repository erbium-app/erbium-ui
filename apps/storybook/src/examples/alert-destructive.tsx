import { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";

export default function AlertDestructive() {
  return (
    <Alert variant="destructive">
      <AlertTitle>Tool call failed</AlertTitle>
      <AlertDescription>
        The agent could not run the test suite. The workspace process exited before returning
        results.
      </AlertDescription>
    </Alert>
  );
}
