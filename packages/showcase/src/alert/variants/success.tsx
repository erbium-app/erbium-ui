import { Alert, AlertDescription, AlertTitle } from "@erbium/ui/components/alert";

export default function AlertSuccessExample() {
  return (
    <Alert variant="success" className="w-96">
      <AlertTitle>Verification passed</AlertTitle>
      <AlertDescription>Type checks and 42 tests passed after the changes.</AlertDescription>
    </Alert>
  );
}
