import { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";

export default function AlertBasicExample() {
  return (
    <Alert className="w-80">
      <AlertTitle>Workspace connected</AlertTitle>
      <AlertDescription>The agent can read the files in this project.</AlertDescription>
    </Alert>
  );
}
