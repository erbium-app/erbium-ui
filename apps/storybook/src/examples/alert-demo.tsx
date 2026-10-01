import { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";

export default function AlertDemo() {
  return (
    <section className="w-full max-w-2xl overflow-hidden rounded-xl border surface-panel">
      <header className="border-b border-transparent px-5 py-4">
        <p className="text-xs font-medium text-muted-foreground">NOVA / AGENT WORKSPACE</p>
        <h2 className="mt-1 font-heading text-lg font-semibold">Refactor the billing flow</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Agent activity across planning, tools, and verification
        </p>
      </header>
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
