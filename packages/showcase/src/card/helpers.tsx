import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@erbium/ui/components/card";

export const SampleCard = ({ size }: { size?: "sm" }) => (
  <Card className="w-80" size={size}>
    <CardHeader>
      <CardTitle>Project update</CardTitle>
      <CardDescription>Everything you need to know at a glance.</CardDescription>
    </CardHeader>
    <CardContent>Review the latest changes and share your feedback.</CardContent>
    <CardFooter>Updated today</CardFooter>
  </Card>
);
