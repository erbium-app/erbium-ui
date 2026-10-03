import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@erbium/ui/components/card";

const Example = () => (
  <Card className="w-80">
    <CardHeader>
      <CardTitle>Recent activity</CardTitle>
    </CardHeader>
    <CardContent className="px-0">
      <div className="border-t bg-muted p-4">Content runs to the card edges.</div>
    </CardContent>
    <CardFooter>View all activity</CardFooter>
  </Card>
);

export default Example;
