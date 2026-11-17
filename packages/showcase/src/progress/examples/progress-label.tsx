import { Progress, ProgressLabel, ProgressValue } from "@erbium/ui/components/progress";

export default function ProgressWithLabelExample() {
  return (
    <Progress value={56} className="w-full max-w-sm">
      <ProgressLabel>Upload progress</ProgressLabel>
      <ProgressValue />
    </Progress>
  );
}
