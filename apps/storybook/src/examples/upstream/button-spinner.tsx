import { Button } from "@erbium/ui/components/button";

export default function ButtonLoading() {
  return (
    <div className="flex gap-2">
      <Button variant="outline" loading>
        Generating
      </Button>
      <Button variant="secondary" loading>
        Downloading
      </Button>
    </div>
  );
}
