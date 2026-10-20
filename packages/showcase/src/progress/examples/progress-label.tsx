import { Progress, ProgressLabel, ProgressValue } from "@erbium/ui/components/progress";

export const ProgressWithLabel = () => (
  <Progress value={56} className="w-full max-w-sm">
    <ProgressLabel>Upload progress</ProgressLabel>
    <ProgressValue />
  </Progress>
);
