import { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";

const Example = () => (
  <Alert className="w-80">
    <AlertTitle>Workspace connected</AlertTitle>
    <AlertDescription>The agent can read the files in this project.</AlertDescription>
  </Alert>
);

export default Example;
