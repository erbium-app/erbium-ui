import { Progress } from "@erbium/ui/components/progress";

export default function ProgressIndeterminateExample() {
  return <Progress value={null} className="w-64" aria-label="Uploading" />;
}
