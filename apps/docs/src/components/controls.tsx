import type { ShowcaseStory } from "@erbium/showcase/catalog";
import { Button } from "@erbium/ui/components/button";
import { Input } from "@erbium/ui/components/input";
import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
} from "@erbium/ui/components/number-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@erbium/ui/components/select";
import { Switch } from "@erbium/ui/components/switch";
import { Table, TableBody, TableCell, TableRow } from "@erbium/ui/components/table";
import { controlRows, displayValue } from "./control-metadata";

type Args = NonNullable<ShowcaseStory["args"]>;

type Row = ReturnType<typeof controlRows>[number];

// The intrinsic validates string values without coercing objects into input text.
const parseText = (value: Row["value"]): string => {
  try {
    return String.prototype.valueOf.call(value);
  } catch {
    return "";
  }
};

const ControlInput = ({
  row,
  value,
  onChange,
}: {
  row: Row;
  value: Row["value"];
  onChange: (value: Row["value"]) => void;
}) => {
  if (row.options !== undefined && row.options.length > 0) {
    const items = [
      { label: "Unset", value: "unset" },
      ...row.options.map((option, index) => ({
        label: displayValue(option),
        value: String(index),
      })),
    ];

    const selectedIndex = row.options.indexOf(value);

    return (
      <Select
        items={items}
        value={selectedIndex === -1 ? "unset" : String(selectedIndex)}
        onValueChange={(selected) => {
          onChange(
            selected === "unset" || selected === null ? undefined : row.options?.[Number(selected)],
          );
        }}
      >
        <SelectTrigger aria-label={row.name} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (row.control === "boolean") {
    return <Switch aria-label={row.name} checked={Boolean(value)} onCheckedChange={onChange} />;
  }

  if (row.control === "number" || row.control === "range") {
    return (
      <NumberField
        value={value === undefined || !Number.isFinite(Number(value)) ? null : Number(value)}
        min={row.constraints?.min}
        max={row.constraints?.max}
        step={row.constraints?.step}
        format={{ maximumFractionDigits: 20, useGrouping: false }}
        onValueChange={(next) => {
          onChange(next ?? undefined);
        }}
      >
        <NumberFieldGroup>
          <NumberFieldInput aria-label={row.name} />
        </NumberFieldGroup>
      </NumberField>
    );
  }

  if (row.control === "text") {
    return (
      <Input
        aria-label={row.name}
        type="text"
        value={parseText(value)}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
    );
  }

  return null;
};

export const Controls = ({
  args,
  defaults,
  argTypes,
  onChange,
  onReset,
}: {
  args: Args;
  defaults: Args;
  argTypes: ShowcaseStory["argTypes"];
  onChange: (args: Args) => void;
  onReset: () => void;
}) => {
  const rows = controlRows({ argTypes, args: defaults, render: () => null }).filter(
    (row) =>
      Boolean(row.options?.length) ||
      row.control === "boolean" ||
      row.control === "text" ||
      row.control === "number" ||
      row.control === "range",
  );

  if (!rows.length) {
    return null;
  }

  return (
    <section className="mt-4 surface-panel rounded-xl overflow-hidden">
      <div className="flex items-center justify-between gap-group p-4 carve-bottom">
        <h3 className="text-caption font-semibold">Props</h3>
        <Button variant="outline" size="xs" onClick={onReset}>
          Reset
        </Button>
      </div>
      <Table aria-label="Playground properties">
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell>
                <code>{row.name}</code>
              </TableCell>
              <TableCell className="w-2/3 min-w-48">
                <ControlInput
                  row={row}
                  value={args[row.name]}
                  onChange={(value) => {
                    const next = Object.fromEntries(
                      Object.entries(args).filter(([name]) => name !== row.name),
                    );

                    onChange(value === undefined ? next : { ...next, [row.name]: value });
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
