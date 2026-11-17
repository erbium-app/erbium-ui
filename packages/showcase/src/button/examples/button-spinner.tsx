import { Button } from "@erbium/ui/components/button";

export default function ButtonLoadingExample() {
  return (
    <div className="flex gap-related">
      <Button variant="outline" loading>
        Generating
      </Button>
      <Button variant="secondary" loading>
        Downloading
      </Button>
    </div>
  );
}
