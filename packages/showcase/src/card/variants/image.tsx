import {
  Card,
  CardDescription,
  CardHeader,
  CardMedia,
  CardTitle,
} from "@erbium/ui/components/card";

const Example = () => (
  <Card className="w-80">
    <CardMedia className="h-40">
      <img
        src="/card-project.svg"
        alt="Abstract illustration of a project dashboard"
        className="size-full object-cover"
      />
    </CardMedia>
    <CardHeader>
      <CardTitle>Featured project</CardTitle>
      <CardDescription>A card with media above its header.</CardDescription>
    </CardHeader>
  </Card>
);

export default Example;
