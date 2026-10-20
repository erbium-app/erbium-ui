import { useState } from "react";
import type { ShowcaseStory } from "@erbium/showcase/catalog";
import { controlRows, displayValue } from "./control-metadata";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@erbium/ui/components/select";
import { Button } from "@erbium/ui/components/button";
import { Switch } from "@erbium/ui/components/switch";
import { Input } from "@erbium/ui/components/input";
import { Textarea } from "@erbium/ui/components/textarea";
import { Field, FieldError } from "@erbium/ui/components/field";
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
} from "@erbium/ui/components/number-field";
import { Slider } from "@erbium/ui/components/slider";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@erbium/ui/components/table";

type Row = ReturnType<typeof controlRows>[number];

const ObjectControl = ({
  value,
  onChange,
  label,
}: {
  value: unknown;
  onChange: (value: unknown) => void;
  label: string;
}) => {
  const [draft, setDraft] = useState(value === undefined ? "" : JSON.stringify(value, null, 2));
  const [error, setError] = useState(false);

  return (
    <Field invalid={error}>
      <Textarea
        aria-label={label}
        aria-invalid={error}
        value={draft}
        rows={2}
        onChange={(event) => {
          setDraft(event.target.value);

          try {
            onChange(event.target.value ? JSON.parse(event.target.value) : undefined);
            setError(false);
          } catch {
            setError(true);
          }
        }}
      />
      <FieldError errors={error ? ["Enter valid JSON."] : []} />
    </Field>
  );
};

const ControlInput = ({
  row,
  value,
  onChange,
}: {
  row: Row;
  value: unknown;
  onChange: (value: unknown) => void;
}) => {
  if (row.options) {
    return (
      <Select
        items={[
          { label: "Unset", value: "" },
          ...row.options.map((option) => ({
            label: typeof option === "string" ? option : displayValue(option),
            value: JSON.stringify(option),
          })),
        ]}
        value={value === undefined ? "" : JSON.stringify(value)}
        onValueChange={(value) => {
          onChange(value ? JSON.parse(value) : undefined);
        }}
      >
        <SelectTrigger aria-label={row.name}>
          <SelectValue placeholder="Unset" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Unset</SelectItem>
          {row.options.map((option) => (
            <SelectItem key={JSON.stringify(option)} value={JSON.stringify(option)}>
              {typeof option === "string" ? option : displayValue(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (row.control === "boolean") {
    return <Switch aria-label={row.name} checked={Boolean(value)} onCheckedChange={onChange} />;
  }

  if (row.control === "object") {
    return <ObjectControl label={row.name} value={value} onChange={onChange} />;
  }

  if (row.control === "number") {
    return (
      <NumberField
        value={typeof value === "number" ? value : null}
        min={row.constraints?.min}
        max={row.constraints?.max}
        step={row.constraints?.step}
        format={{ maximumFractionDigits: 20, useGrouping: false }}
        onValueChange={(next) => {
          onChange(next ?? undefined);
        }}
      >
        <NumberFieldGroup>
          <NumberFieldDecrement aria-label={`Decrease ${row.name}`} />
          <NumberFieldInput aria-label={row.name} />
          <NumberFieldIncrement aria-label={`Increase ${row.name}`} />
        </NumberFieldGroup>
      </NumberField>
    );
  }

  if (row.control === "range") {
    return (
      <Slider
        aria-label={row.name}
        value={typeof value === "number" ? value : (row.constraints?.min ?? 0)}
        min={row.constraints?.min}
        max={row.constraints?.max}
        step={row.constraints?.step}
        onValueChange={(next) => {
          onChange(Array.isArray(next) ? next[0] : next);
        }}
      />
    );
  }

  if (row.control === "text") {
    return (
      <Input
        aria-label={row.name}
        type="text"
        value={typeof value === "string" || typeof value === "number" ? value : ""}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
    );
  }

  return (
    <span className="text-muted-foreground">
      {row.type === "callback" ? "Event callback" : "Read only"}
    </span>
  );
};

export const Controls = ({
  args,
  defaults,
  argTypes,
  onChange,
  onReset,
}: {
  args: Record<string, unknown>;
  defaults: Record<string, unknown>;
  argTypes: ShowcaseStory["argTypes"];
  onChange: (args: Record<string, unknown>) => void;
  onReset: () => void;
}) => {
  const rows = controlRows({ argTypes, args: defaults, render: () => null });

  if (!rows.length) {
    return null;
  }

  return (
    <section className="mt-4 surface-panel rounded-xl overflow-hidden">
      <div className="flex items-center justify-between gap-group p-4 carve-bottom">
        <div>
          <h3 className="text-caption font-semibold">Playground API</h3>
          <p className="text-metadata text-muted-foreground">
            Explore the props. Changes update the preview above.
          </p>
        </div>
        <Button variant="outline" size="xs" onClick={onReset}>
          Reset
        </Button>
      </div>
      <Table aria-label="Playground properties">
        <TableHeader>
          <TableRow>
            <TableHead>Property / type</TableHead>
            <TableHead>Example default</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell>
                <code>{row.name}</code>
                <p className="text-metadata text-muted-foreground">{row.type}</p>
                {row.description && (
                  <p className="text-metadata text-muted-foreground">{row.description}</p>
                )}
              </TableCell>
              <TableCell>
                <code className="text-metadata">{displayValue(row.value)}</code>
              </TableCell>
              <TableCell>
                <ControlInput
                  row={row}
                  value={args[row.name]}
                  onChange={(value) => {
                    const next = { ...args };

                    if (value === undefined) {
                      delete next[row.name];
                    } else {
                      next[row.name] = value;
                    }

                    onChange(next);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};
