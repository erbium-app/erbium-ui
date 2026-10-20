import { Button } from "@erbium/ui/components/button";

const SpinnerButton = () => (
  <div className="flex flex-col items-center gap-group">
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

export default SpinnerButton;
