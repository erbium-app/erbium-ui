import { Button } from "@erbium/ui/components/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@erbium/ui/components/field";
import { Input } from "@erbium/ui/components/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@erbium/ui/components/select";

export function InputForm() {
  const countries = [
    { label: "United States", value: "us" },
    { label: "United Kingdom", value: "uk" },
    { label: "Canada", value: "ca" },
  ];

  return (
    <form className="w-full max-w-sm">
      <FieldGroup>
        <Field>
          <FieldLabel>Name</FieldLabel>
          <Input type="text" placeholder="Alex Smith" required />
        </Field>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input type="email" placeholder="john@example.com" />
          <FieldDescription>We&apos;ll never share your email with anyone.</FieldDescription>
        </Field>
        <div className="grid grid-cols-2 gap-group">
          <Field>
            <FieldLabel>Phone</FieldLabel>
            <Input type="tel" placeholder="+1 (555) 123-4567" />
          </Field>
          <Field>
            <FieldLabel htmlFor="form-country">Country</FieldLabel>
            <Select items={countries} defaultValue="us">
              <SelectTrigger id="form-country">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field>
          <FieldLabel>Address</FieldLabel>
          <Input type="text" placeholder="123 Main St" />
        </Field>
        <Field orientation="horizontal">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
