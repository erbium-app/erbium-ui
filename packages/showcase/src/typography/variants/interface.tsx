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

const InterfaceExample = () => (
  <div className="grid w-full gap-section lg:grid-cols-2">
    <section className="grid content-start gap-group" aria-label="Typography roles">
      <h1 className="text-display">A place for your team</h1>
      <h2 className="text-title">Work together</h2>
      <h3 className="text-subtitle">Keep projects moving</h3>
      <p className="text-body max-w-[65ch]">
        Share progress, invite collaborators, and give every project a clear next step.
      </p>
      <p className="text-caption text-muted-foreground">
        Your preferences apply to this workspace.
      </p>
    </section>
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Workspace preferences</CardTitle>
        <CardDescription>Update the name shown to workspace members.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-related">
        <Field>
          <FieldLabel htmlFor="typography-workspace">Workspace name</FieldLabel>
          <Input id="typography-workspace" defaultValue="Erbium Studio" />
        </Field>
        <p className="text-caption text-muted-foreground">Use a name your team will recognize.</p>
      </CardContent>
      <CardFooter>
        <Button>Save preferences</Button>
      </CardFooter>
    </Card>
  </div>
);

export default InterfaceExample;
