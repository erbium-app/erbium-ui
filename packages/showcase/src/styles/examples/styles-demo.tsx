import { Button } from "@erbium/ui/components/button";
import { Card, CardContent } from "@erbium/ui/components/card";
export default function Demo() {
  return (
    <Card>
      <CardContent className="flex flex-wrap gap-3 p-6">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </CardContent>
    </Card>
  );
}
