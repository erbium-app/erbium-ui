import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@erbium/ui/components/card";

export function SampleCard({ size }: { size?: "sm" }) {
  return (
    <Card className="w-80" size={size}>
      <CardHeader>
        <CardTitle>Project update</CardTitle>
        <CardDescription>Everything you need to know at a glance.</CardDescription>
      </CardHeader>
      <CardContent>Review the latest changes and share your feedback.</CardContent>
      <CardFooter>Updated today</CardFooter>
    </Card>
  );
}
