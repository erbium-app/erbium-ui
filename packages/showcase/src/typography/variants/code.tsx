import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@erbium/ui/components/card";

export default function CodeExample() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Install your first component</CardTitle>
        <CardDescription>Run the command below to add a component to your project.</CardDescription>
      </CardHeader>
      <CardContent className="typeset typeset-compact">
        <p>
          Install <code>@erbium/button</code> from the registry.
        </p>
        <pre>
          <code>{"bunx shadcn@latest add @erbium/button\n\n<Button>Continue</Button>"}</code>
        </pre>
        <p className="font-mono text-caption leading-code">0123456789 · Il1 O0 · {"{} [] => !="}</p>
      </CardContent>
    </Card>
  );
}
