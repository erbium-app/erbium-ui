import {
  Filters as FiltersPrimitive,
  getFilterEditor,
  getFilterOperatorChoices,
  getFilterSummary,
  isOptionType,
  useFieldPicker,
  useFilterEditorState,
  useOptionPicker,
} from "@erbium-ui/react/filters";
import type { IconName } from "@erbium/icons";
import * as React from "react";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { ButtonGroup } from "../components/button-group";
import { Calendar } from "../components/calendar";
import {
  Cascader,
  CascaderClear,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderSearch,
  CascaderTrigger,
} from "../components/cascader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../components/dropdown-menu";
import { Icon } from "../components/icon";
import { Input } from "../components/input";
import { NumberField, NumberFieldGroup, NumberFieldInput } from "../components/number-field";
import { Popover, PopoverContent, PopoverTrigger } from "../components/popover";
import { Separator } from "../components/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/tooltip";
import type { FilterField, Filters } from "../lib/filter-rules";
import { buttonVariants } from "../lib/button-variants";
import { cn } from "../lib/utils";

/*
 * Erbium's filter layouts on the @erbium-ui/react filters primitive. The primitive owns rule
 * changes, the add-filter and option pickers' behavior, and the operator, remove, text value and
 * clear parts; this file closes the design to three layouts (a bar of chips, facets, an add
 * menu), fixed editors per type (a cascader for options, a number field pair, a calendar) and
 * summaries that name up to two options.
 */

const summaryOptions = (field: FilterField) => ({
  formatText: (text: string) => `“${text}”`,
  maxOptionLabels: 2,
  numberFormat: field.format,
});

// Option trees

/** The content of a picker row, including its facet count when available. */
const OptionRow = ({
  label,
  icon,
  count,
}: {
  label: string;
  icon: IconName | undefined;
  count: number | undefined;
}) => (
  <>
    {icon === undefined ? null : <Icon name={icon} aria-hidden="true" />}
    <span className="truncate">{label}</span>
    {count === undefined ? null : (
      <span className="ms-auto ps-4 text-muted-foreground tabular-nums">{count}</span>
    )}
  </>
);

type FilterEditor = ReturnType<typeof getFilterEditor>;

type NumberInputProps = Extract<FilterEditor, { type: "number" }>["start"];

const NumberInput = ({ label, placeholder, ...props }: NumberInputProps) => (
  <NumberField size="sm" {...props}>
    <NumberFieldGroup>
      <NumberFieldInput aria-label={label} placeholder={placeholder} />
    </NumberFieldGroup>
  </NumberField>
);

const ValueEditor = ({ field, editor }: { field: FilterField; editor: FilterEditor }) => {
  if (editor.type === "number") {
    return editor.end === undefined ? (
      <NumberInput {...editor.start} />
    ) : (
      <div className="grid grid-cols-2 gap-related">
        <NumberInput {...editor.start} />
        <NumberInput {...editor.end} />
      </div>
    );
  }

  if (editor.type === "date") {
    return <Calendar {...editor.calendar} />;
  }

  if (editor.type !== "text") {
    return null;
  }

  return (
    <FiltersPrimitive.Field field={field}>
      <FiltersPrimitive.Value render={<Input placeholder={field.placeholder ?? "Enter text…"} />} />
    </FiltersPrimitive.Field>
  );
};

/** The editor for a text, number or date field's value. Render inside a popover. */
const FilterValueEditor = ({ field }: { field: FilterField }) => (
  <ValueEditor field={field} editor={getFilterEditor(field, { numberFormat: field.format })} />
);

interface FilterValueControlProps {
  field: FilterField;
  /** The button that opens the editor. */
  trigger: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Content after the editor, such as a clear action. */
  footer?: React.ReactNode;
  align?: "start" | "center" | "end";
}

/**
 * An option field's options in a searchable cascader, opened from a trigger. Options with
 * children open their level in place, and each option shows its count when the field has counts.
 * While more options are chosen than a summary names, hovering the trigger lists them in a tooltip.
 */
const FilterOptionMenu = ({
  field,
  trigger,
  open,
  onOpenChange,
  footer,
  align = "start",
}: FilterValueControlProps) => {
  const picker = useOptionPicker(field);
  const summary = getFilterSummary(field, summaryOptions(field));

  // The tooltip is always mounted and only disabled, so the trigger keeps its element (and an
  // open menu keeps its anchor) when one more chosen option turns the names into a count.
  return (
    <Tooltip disabled={!summary.collapsed}>
      <Cascader {...picker} multiple searchable open={open} onOpenChange={onOpenChange}>
        <CascaderTrigger render={<TooltipTrigger render={trigger} />} />
        <CascaderContent align={align} className="w-64">
          <CascaderSearch
            aria-label={`Search ${field.label}`}
            placeholder={`Search ${field.label.toLocaleLowerCase()}…`}
          />
          <CascaderEmpty>No options found.</CascaderEmpty>
          <CascaderList<(typeof picker.items)[number]>>
            {({ label, data }) => (
              <OptionRow label={label} icon={data.option.icon} count={data.count} />
            )}
          </CascaderList>
          {footer}
        </CascaderContent>
      </Cascader>
      <TooltipContent>{summary.options.map(({ label }) => label).join(", ")}</TooltipContent>
    </Tooltip>
  );
};

/**
 * Opens a field's value editor from a trigger: a searchable cascader for option fields, a popover
 * for the others. A text, number or date filter left without a value is removed when it closes.
 */
const FilterValueControl = ({
  field,
  trigger,
  open,
  onOpenChange,
  footer,
  align = "start",
}: FilterValueControlProps) => {
  if (isOptionType(field.type)) {
    return (
      <FilterOptionMenu
        field={field}
        trigger={trigger}
        open={open}
        onOpenChange={onOpenChange}
        footer={footer}
        align={align}
      />
    );
  }

  const editor = getFilterEditor(field, { numberFormat: field.format, onOpenChange });

  const { onOpenChange: handleOpenChange } = editor;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger render={trigger} />
      <PopoverContent align={align} className={editor.type === "date" ? "w-auto" : "w-64"}>
        <ValueEditor field={field} editor={editor} />
        {footer}
      </PopoverContent>
    </Popover>
  );
};

// Chip mode

/** The menu that changes a filter's operator. */
const FilterOperatorMenu = ({ field }: { field: FilterField }) => {
  const choices = getFilterOperatorChoices(field);

  if (choices === null) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="sm" className="text-muted-foreground" />}
      >
        {choices.label}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <FiltersPrimitive.Field field={field}>
          <FiltersPrimitive.Operator>
            {choices.items.map(({ label, operator }) => (
              <DropdownMenuRadioItem key={operator} value={operator}>
                {label}
              </DropdownMenuRadioItem>
            ))}
          </FiltersPrimitive.Operator>
        </FiltersPrimitive.Field>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface FilterChipProps {
  field: FilterField;
  /** Whether the value editor is open, for a bar that opens it when the filter is added. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** One active filter as a chip: field, operator, value, and a remove button. */
const FilterChip = ({ field, open, onOpenChange, className }: FilterChipProps) => (
  <ButtonGroup data-slot="filter-chip" aria-label={`${field.label} filter`} className={className}>
    {/* The field segment takes the buttons' surface and size so the chip reads as one control. */}
    <span
      data-slot="filter-chip-field"
      className={cn(
        buttonVariants({ size: "sm", variant: "outline" }),
        "pointer-events-none cursor-default",
      )}
    >
      {field.icon === undefined ? null : (
        <Icon
          name={field.icon}
          aria-hidden="true"
          data-icon="inline-start"
          className="text-muted-foreground"
        />
      )}
      {field.label}
    </span>
    <FilterOperatorMenu field={field} />
    <FilterValueControl
      field={field}
      open={open}
      onOpenChange={onOpenChange}
      trigger={
        <Button variant="outline" size="sm" className="max-w-56">
          <FiltersPrimitive.Field field={field}>
            <FiltersPrimitive.Summary
              className="truncate data-empty:text-muted-foreground"
              options={summaryOptions(field)}
              placeholder="Choose…"
            />
          </FiltersPrimitive.Field>
        </Button>
      }
    />
    <FiltersPrimitive.Field field={field}>
      <FiltersPrimitive.Remove render={<Button variant="outline" size="icon-sm" />}>
        <Icon name="x" aria-hidden="true" />
      </FiltersPrimitive.Remove>
    </FiltersPrimitive.Field>
  </ButtonGroup>
);

interface FilterMenuProps {
  filters: Filters;
  /** Called with a text, number or date field just added, so its value editor can open. */
  onFieldAdded?: (id: string) => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * The searchable menu that adds filters, built on the cascader. Option fields open their options
 * in place, and the search finds fields and options at any depth. Text, number and date fields
 * add an empty filter and hand off to its value editor.
 */
const FilterMenu = ({ filters, onFieldAdded, className, children = "Filter" }: FilterMenuProps) => {
  const picker = useFieldPicker(filters, { onFieldAdded });

  return (
    <Cascader multiple {...picker} searchable>
      <CascaderTrigger render={<Button variant="outline" size="sm" className={className} />}>
        <Icon name="list-filter" aria-hidden="true" data-icon="inline-start" />
        {children}
      </CascaderTrigger>
      <CascaderContent className="w-64">
        <CascaderSearch aria-label="Search filters" placeholder="Filter by…" />
        <CascaderEmpty>No filters found.</CascaderEmpty>
        <CascaderList<(typeof picker.items)[number]>>
          {({ label, data }) => (
            <OptionRow
              label={label}
              icon={data.option === undefined ? data.field.icon : data.option.icon}
              count={data.count}
            />
          )}
        </CascaderList>
      </CascaderContent>
    </Cascader>
  );
};

interface FilterBarProps extends Omit<React.ComponentProps<"div">, "children"> {
  filters: Filters;
  /** Content after the chips, such as a search input or view options. */
  children?: React.ReactNode;
}

/** Chip mode: an add-filter menu, a chip for each active filter, and a clear action. */
const FilterBar = ({ filters, className, children, ...props }: FilterBarProps) => {
  const { getEditorProps, onFieldAdded: handleFieldAdded } = useFilterEditorState();

  return (
    <div
      data-slot="filter-bar"
      className={cn("flex min-w-0 flex-wrap items-center gap-related", className)}
      {...props}
    >
      <FilterMenu filters={filters} onFieldAdded={handleFieldAdded} />
      {filters.active.map((field) => (
        <FilterChip key={field.id} field={field} {...getEditorProps(field)} />
      ))}
      {filters.active.length === 0 ? null : (
        <FiltersPrimitive.Root filters={filters}>
          <FiltersPrimitive.Clear render={<Button variant="ghost" size="sm" />}>
            Clear
          </FiltersPrimitive.Clear>
        </FiltersPrimitive.Root>
      )}
      {children}
    </div>
  );
};

// Faceted mode

const FacetSummary = ({ summary }: { summary: ReturnType<typeof getFilterSummary> }) =>
  summary.collapsed || summary.options.length === 0 ? (
    <Badge variant="secondary" className="max-w-40">
      <span className="truncate">{summary.text}</span>
    </Badge>
  ) : (
    summary.options.map(({ value, label }) => (
      <Badge key={value} variant="secondary">
        {label}
      </Badge>
    ))
  );

const FacetClear = ({ field }: { field: FilterField }) => {
  if (!isOptionType(field.type)) {
    return (
      <FiltersPrimitive.Field field={field}>
        <FiltersPrimitive.Remove
          aria-label={undefined}
          render={<Button variant="ghost" size="sm" />}
        >
          Clear filter
        </FiltersPrimitive.Remove>
      </FiltersPrimitive.Field>
    );
  }

  // Clearing the cascader's selection removes the filter.
  return <CascaderClear>Clear filter</CascaderClear>;
};

interface FilterFacetProps {
  field: FilterField;
  className?: string;
}

/**
 * Faceted mode: a button for one field that shows its chosen values and opens its value editor.
 * Option fields mean "is any of"; text, number and date fields use their first operator.
 */
const FilterFacet = ({ field, className }: FilterFacetProps) => {
  const summary = getFilterSummary(field, summaryOptions(field));
  const active = summary.text !== null;

  return (
    <FilterValueControl
      field={field}
      footer={active || isOptionType(field.type) ? <FacetClear field={field} /> : null}
      trigger={
        <Button
          data-slot="filter-facet"
          variant="outline"
          size="sm"
          // Badges are as tall as the padded content box, so the padding goes and the height stays.
          className={cn("border-dashed has-data-[slot=badge]:py-0", className)}
        >
          <Icon
            name={active ? (field.icon ?? "list-filter") : "circle-fading-plus"}
            aria-hidden="true"
            data-icon="inline-start"
          />
          {field.label}
          {active ? (
            <>
              <Separator orientation="vertical" className="mx-0.5 -my-px h-auto self-stretch" />
              <FacetSummary summary={summary} />
            </>
          ) : null}
        </Button>
      }
    />
  );
};

interface FilterFacetsProps extends Omit<React.ComponentProps<"div">, "children"> {
  filters: Filters;
  /** The fields to show, by id, in order. Left out, every filterable field is shown. */
  fields?: string[];
  /** Content before the buttons, such as a search input. */
  children?: React.ReactNode;
}

/** Faceted mode: a button per field, then a reset action while any filter is active. */
const FilterFacets = ({ filters, fields, className, children, ...props }: FilterFacetsProps) => {
  const shown =
    fields === undefined
      ? filters.fields
      : fields.flatMap((id) => filters.fields.filter((field) => field.id === id));

  return (
    <div
      data-slot="filter-facets"
      className={cn("flex min-w-0 flex-wrap items-center gap-related", className)}
      {...props}
    >
      {children}
      {shown.map((field) => (
        <FilterFacet key={field.id} field={field} />
      ))}
      {filters.active.length === 0 ? null : (
        <FiltersPrimitive.Root filters={filters}>
          <FiltersPrimitive.Clear render={<Button variant="ghost" size="sm" />}>
            Reset
            <Icon name="x" aria-hidden="true" data-icon="inline-end" />
          </FiltersPrimitive.Clear>
        </FiltersPrimitive.Root>
      )}
    </div>
  );
};

export {
  FilterBar,
  FilterChip,
  FilterFacet,
  FilterFacets,
  FilterMenu,
  FilterOperatorMenu,
  FilterOptionMenu,
  FilterValueControl,
  FilterValueEditor,
};

export type {
  FilterBarProps,
  FilterChipProps,
  FilterFacetProps,
  FilterFacetsProps,
  FilterMenuProps,
  FilterValueControlProps,
};
