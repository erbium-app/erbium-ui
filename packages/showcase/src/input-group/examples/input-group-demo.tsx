import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@erbium/ui/components/input-group";

export default function InputGroupExample() {
  return (
    <InputGroup className="w-80">
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput aria-label="Website" placeholder="example.com" />
    </InputGroup>
  );
}
