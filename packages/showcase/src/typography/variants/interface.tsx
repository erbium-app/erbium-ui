import { Button } from "@erbium/ui/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@erbium/ui/components/card";
import { Input } from "@erbium/ui/components/input";
import { Field, FieldLabel } from "@erbium/ui/components/field";

export default function InterfaceExample() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Workspace preferences</CardTitle>
        <CardDescription>Update the name shown to workspace members.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Field>
          <FieldLabel htmlFor="typography-workspace">Workspace name</FieldLabel>
          <Input id="typography-workspace" defaultValue="Erbium Studio" />
        </Field>
        <p className="text-xs text-muted-foreground">Use a name your team will recognize.</p>
      </CardContent>
      <CardFooter>
        <Button>Save preferences</Button>
      </CardFooter>
    </Card>
  );
}
