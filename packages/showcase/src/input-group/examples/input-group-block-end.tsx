import { Field, FieldDescription, FieldGroup, FieldLabel } from "@erbium/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@erbium/ui/components/input-group";

export const InputGroupBlockEnd = () => (
  <FieldGroup className="max-w-sm">
    <Field>
      <FieldLabel>Input</FieldLabel>
      <InputGroup className="h-auto">
        <InputGroupInput placeholder="Enter amount" />
        <InputGroupAddon align="block-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Footer positioned below the input.</FieldDescription>
    </Field>
    <Field>
      <FieldLabel>Textarea</FieldLabel>
      <InputGroup>
        <InputGroupTextarea placeholder="Write a comment..." />
        <InputGroupAddon align="block-end">
          <InputGroupText>0/280</InputGroupText>
          <InputGroupButton variant="default" size="sm" className="ml-auto">
            Post
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Footer positioned below the textarea.</FieldDescription>
    </Field>
  </FieldGroup>
);
