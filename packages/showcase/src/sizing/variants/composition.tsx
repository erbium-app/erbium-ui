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
import { Field, FieldLabel, FieldGroup } from "@erbium/ui/components/field";

const CompositionExample = () => (
  <div className="grid gap-section p-panel sm:grid-cols-2">
    {(["default", "sm"] as const).map((size) => (
      <Card key={size} size={size}>
        <CardHeader>
          <CardTitle>Project settings</CardTitle>
          <CardDescription>
            Panel size changes spacing, while text retains its role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Project name</FieldLabel>
              <Input defaultValue="Erbium" />
            </Field>
            <Field>
              <FieldLabel>Team</FieldLabel>
              <Input defaultValue="Design systems" />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex-wrap justify-end gap-related">
          <Button variant="ghost">Cancel</Button>
          <Button>Save changes</Button>
        </CardFooter>
      </Card>
    ))}
  </div>
);

export default CompositionExample;
