// @ts-nocheck
import { Alert, AlertDescription, AlertTitle } from "../components/alert";

export default function AlertError() {
  return (
    <Alert variant="error">
      <AlertTitle>Tool call failed</AlertTitle>
      <AlertDescription>
        The agent could not run the test suite. The workspace process exited before returning
        results.
      </AlertDescription>
    </Alert>
  );
}
