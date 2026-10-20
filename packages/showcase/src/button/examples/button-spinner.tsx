import { Button } from "@erbium/ui/components/button";

const ButtonLoading = () => (
  <div className="flex gap-related">
    <Button variant="outline" loading>
      Generating
    </Button>
    <Button variant="secondary" loading>
      Downloading
    </Button>
  </div>
);

export default ButtonLoading;
