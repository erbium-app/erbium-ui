import { Button } from "@erbium/ui/components/button";

export default function SpinnerButton() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button loading size="sm">
        Loading...
      </Button>
      <Button variant="outline" loading size="sm">
        Please wait
      </Button>
      <Button variant="secondary" loading size="sm">
        Processing
      </Button>
    </div>
  );
}
