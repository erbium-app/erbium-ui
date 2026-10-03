import { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";

const Example = () => (
  <Alert variant="info" className="w-96">
    <AlertTitle>Plan ready</AlertTitle>
    <AlertDescription>
      The agent identified three files to update before writing code.
    </AlertDescription>
  </Alert>
);

export default Example;
