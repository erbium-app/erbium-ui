import { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";

export default function AlertExample() {
  return (
    <section className="w-full max-w-2xl">
      <div className="grid gap-3 p-5">
        <Alert>
          <AlertTitle>Workspace connected</AlertTitle>
          <AlertDescription>
            The agent can read the app and package files for this task.
          </AlertDescription>
        </Alert>
        <Alert variant="info">
          <AlertTitle>Plan ready</AlertTitle>
          <AlertDescription>
            The agent identified three files to update before writing code.
          </AlertDescription>
        </Alert>
        <Alert variant="success">
          <AlertTitle>Verification passed</AlertTitle>
          <AlertDescription>Type checks and 42 tests passed after the changes.</AlertDescription>
        </Alert>
        <Alert variant="warning">
          <AlertTitle>Approval required</AlertTitle>
          <AlertDescription>
            The agent needs permission to install a new dependency.
          </AlertDescription>
        </Alert>
        <Alert variant="error">
          <AlertTitle>Browser preview failed</AlertTitle>
          <AlertDescription>
            The preview server did not start. Check the build log and retry.
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
}
