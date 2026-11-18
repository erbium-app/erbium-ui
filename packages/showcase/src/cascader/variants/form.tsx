import * as React from "react";

import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderSearch,
  CascaderTrigger,
  CascaderValue,
} from "@erbium/ui/components/cascader";
import { FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { Form, useAppForm } from "@erbium/ui/components/form";

import { regions } from "../examples/cascader-data";

export default function CascaderFormExample() {
  const id = React.useId();

  const form = useAppForm({
    defaultValues: {
      office: "",
    },
  });

  return (
    <Form form={form} className="flex w-72 flex-col gap-group">
      <form.AppField
        name="office"
        validators={{
          onDynamic: ({ value }) => (value === "" ? "Choose an office." : undefined),
        }}
      >
        {(field) => (
          <field.Field required>
            <FieldLabel htmlFor={id}>Office</FieldLabel>
            <Cascader
              searchable
              items={regions}
              value={field.state.value === "" ? null : field.state.value}
              onValueChange={(next) => {
                field.handleChange(next ?? "");
              }}
              onOpenChange={(open) => {
                // The trigger loses focus to the search while the menu is open, so the field
                // is touched when the menu closes.
                if (!open) {
                  field.handleBlur();
                }
              }}
            >
              <CascaderTrigger id={id} className="w-full">
                <CascaderValue placeholder="Choose a city" />
              </CascaderTrigger>
              <CascaderContent>
                <CascaderSearch placeholder="Search places…" />
                <CascaderEmpty>No places found.</CascaderEmpty>
                <CascaderList />
              </CascaderContent>
            </Cascader>
            <FieldDescription>Where you will work from.</FieldDescription>
            <field.FieldError />
          </field.Field>
        )}
      </form.AppField>
      <form.SubmitButton className="self-start">Submit</form.SubmitButton>
      <form.Subscribe
        selector={(state) => (state.isSubmitSuccessful ? state.values.office : undefined)}
      >
        {(office) =>
          office === undefined ? null : (
            <output className="text-caption text-muted-foreground">office={office}</output>
          )
        }
      </form.Subscribe>
    </Form>
  );
}
