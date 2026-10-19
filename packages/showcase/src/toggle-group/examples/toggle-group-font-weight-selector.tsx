import * as React from "react";

import { Field, FieldDescription, FieldLabel } from "@erbium/ui/components/field";
import { ToggleGroup, ToggleGroupItem } from "@erbium/ui/components/toggle-group";

export function ToggleGroupFontWeightSelector() {
  const [fontWeight, setFontWeight] = React.useState("normal");

  return (
    <Field>
      <FieldLabel>Font Weight</FieldLabel>
      <ToggleGroup
        className="flex-wrap"
        value={[fontWeight]}
        onValueChange={(value) => {
          setFontWeight(value[0]);
        }}
        variant="outline"
        spacing={2}
        size="lg"
      >
        <ToggleGroupItem
          value="semibold"
          aria-label="Semibold"
          className="flex min-w-20 flex-col items-center justify-center rounded-xl"
        >
          <span className="text-title font-semibold">Aa</span>
          <span className="text-metadata text-muted-foreground">Semibold</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="normal"
          aria-label="Regular"
          className="flex min-w-20 flex-col items-center justify-center rounded-xl"
        >
          <span className="text-title font-normal">Aa</span>
          <span className="text-metadata text-muted-foreground">Regular</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="medium"
          aria-label="Medium"
          className="flex min-w-20 flex-col items-center justify-center rounded-xl"
        >
          <span className="text-title font-medium">Aa</span>
          <span className="text-metadata text-muted-foreground">Medium</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          value="bold"
          aria-label="Bold"
          className="flex min-w-20 flex-col items-center justify-center rounded-xl"
        >
          <span className="text-title font-bold">Aa</span>
          <span className="text-metadata text-muted-foreground">Bold</span>
        </ToggleGroupItem>
      </ToggleGroup>
      <FieldDescription>
        Use <code className="rounded-md bg-muted px-1 py-0.5 font-mono">font-{fontWeight}</code> to
        set the font weight.
      </FieldDescription>
    </Field>
  );
}
