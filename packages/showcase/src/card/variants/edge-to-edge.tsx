import { Card, CardFooter, CardHeader, CardTitle } from "@erbium/ui/components/card";

const Example = () => (
  <Card className="w-80">
    <CardHeader>
      <CardTitle>Recent activity</CardTitle>
    </CardHeader>
    <div className="border-t bg-muted p-panel">Content runs to the card edges.</div>
    <CardFooter>View all activity</CardFooter>
  </Card>
);

export default Example;
