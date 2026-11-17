import { Badge } from "@erbium/ui/components/badge";
import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Input } from "@erbium/ui/components/input";

export default function InputBadgeExample() {
  return (
    <Field>
      <FieldLabel>
        Webhook URL{" "}
        <Badge variant="secondary" className="ml-auto">
          Beta
        </Badge>
      </FieldLabel>
      <Input type="url" placeholder="https://api.example.com/webhook" />
    </Field>
  );
}
