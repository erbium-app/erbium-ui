import { Card, CardDescription, CardHeader, CardTitle } from "@erbium/ui/components/card";

const Example = () => (
  <Card className="w-80">
    <img
      src="/card-project.svg"
      alt="Abstract illustration of a project dashboard"
      className="h-40 w-full object-cover"
    />
    <CardHeader>
      <CardTitle>Featured project</CardTitle>
      <CardDescription>A card with media above its header.</CardDescription>
    </CardHeader>
  </Card>
);

export default Example;
