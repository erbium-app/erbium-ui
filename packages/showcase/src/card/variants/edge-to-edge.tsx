import { Card, CardFooter, CardHeader, CardTitle } from "@erbium/ui/components/card";
import { Separator } from "@erbium/ui/components/separator";

const Example = () => (
  <Card className="w-80">
    <CardHeader>
      <CardTitle>Recent activity</CardTitle>
    </CardHeader>
    <Separator variant="full" />
    <div className="bg-muted p-panel">Content runs to the card edges.</div>
    <CardFooter>View all activity</CardFooter>
  </Card>
);

export default Example;
