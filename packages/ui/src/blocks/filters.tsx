import * as React from "react";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { ButtonGroup } from "../components/button-group";
import { Calendar } from "../components/calendar";
import type { DateRange } from "../components/calendar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuEmpty,
  DropdownMenuItem,
  DropdownMenuList,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSearch,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../components/dropdown-menu";
import { Icon } from "../components/icon";
import { Input } from "../components/input";
import { NumberField, NumberFieldGroup, NumberFieldInput } from "../components/number-field";
import { Popover, PopoverContent, PopoverTrigger } from "../components/popover";
import { Separator } from "../components/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/tooltip";
import {
  changeOperator,
  createRule,
  filterOperators,
  formatDayKey,
  getOperatorLabel,
  isFilterOperator,
  isNumber,
  isOptionType,
  isRangeOperator,
  isRuleEmpty,
  isText,
  parseDayKey,
} from "../lib/filter-rules";
import type { FilterField, FilterValue, Filters } from "../lib/filter-rules";
import { buttonVariants } from "../lib/button-variants";
import { cn } from "../lib/utils";

/*
 * Filter components. Every layout here reads the same `Filters` (from `useTableFilters` or
 * `useListFilters`) and edits values with the same controls: option fields in a searchable menu,
 * text, number and date fields in a popover. The layouts differ only in how they present fields.
 */

// Rule changes

const setValues = (field: FilterField, values: FilterValue[]) => {
  field.setRule({ ...(field.rule ?? createRule(field.type)), values });
};

/** Checks or unchecks an option. Unchecking the last option removes the filter. */
const toggleOption = (field: FilterField, value: string, checked: boolean) => {
  const values = (field.rule?.values ?? []).filter((current) => current !== value);
  const next = checked ? [...values, value] : values;

  if (next.length === 0) {
    field.setRule(undefined);
  } else {
    setValues(field, next);
  }
};

const removeRule = (field: FilterField) => {
  field.setRule(undefined);
};

// Summaries

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

const formatValue = (field: FilterField, value: FilterValue | undefined): string | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (field.type === "number" && isNumber(value)) {
    return new Intl.NumberFormat(undefined, field.format).format(value);
  }

  if (field.type === "date" && isText(value)) {
    return dateFormat.format(parseDayKey(value));
  }

  return field.options.find((option) => option.value === value)?.label ?? String(value);
};

/** How many chosen options a summary names; past this it counts them instead. */
const listedOptionLimit = 2;

/** Whether a field's summary counts its chosen options instead of naming them. */
const isCounted = (field: FilterField): boolean =>
  isOptionType(field.type) && (field.rule?.values.length ?? 0) > listedOptionLimit;

/** The chosen options a counted summary leaves out, named in full, or `null` when none are. */
const countedValues = (field: FilterField): string | null =>
  isCounted(field)
    ? (field.rule?.values ?? []).map((value) => formatValue(field, value)).join(", ")
    : null;

/** What a field's value reads as in a chip or facet button, or `null` while it has none. */
const summarize = (field: FilterField): string | null => {
  const { rule } = field;

  if (rule === undefined || isRuleEmpty(rule)) {
    return null;
  }

  if (isOptionType(field.type)) {
    return isCounted(field)
      ? `${rule.values.length} selected`
      : rule.values.map((value) => formatValue(field, value)).join(", ");
  }

  const [first, second] = rule.values;

  if (isRangeOperator(rule.operator)) {
    return `${formatValue(field, first) ?? "…"} – ${formatValue(field, second) ?? "…"}`;
  }

  return field.type === "text" ? `“${first ?? ""}”` : formatValue(field, first);
};

// Value editors

/** The checkable options of an option field, with their counts. Render inside a menu list. */
const FilterOptionItems = ({ field }: { field: FilterField }) => {
  const chosen = new Set(field.rule?.values);

  return field.options.map((option) => (
    <DropdownMenuCheckboxItem
      key={option.value}
      label={option.label}
      checked={chosen.has(option.value)}
      onCheckedChange={(checked) => {
        toggleOption(field, option.value, checked);
      }}
    >
      {option.icon === undefined ? null : <Icon name={option.icon} aria-hidden="true" />}
      <span className="truncate">{option.label}</span>
      {field.counts === undefined ? null : (
        <span className="ms-auto ps-4 text-muted-foreground tabular-nums">
          {field.counts.get(option.value) ?? 0}
        </span>
      )}
    </DropdownMenuCheckboxItem>
  ));
};

/** A searchable option list: search, empty message and items, for any menu popup. */
const FilterOptionMenu = ({ field }: { field: FilterField }) => (
  <>
    <DropdownMenuSearch
      aria-label={`Search ${field.label}`}
      placeholder={`Search ${field.label.toLocaleLowerCase()}…`}
    />
    <DropdownMenuEmpty>No options found.</DropdownMenuEmpty>
    <DropdownMenuList>
      <FilterOptionItems field={field} />
    </DropdownMenuList>
  </>
);

interface NumberInputProps {
  field: FilterField;
  label: string;
  value: number | null;
  onValueChange: (value: number | null) => void;
  placeholder?: number;
}

const NumberInput = ({ field, label, value, onValueChange, placeholder }: NumberInputProps) => (
  <NumberField
    size="sm"
    value={value}
    min={field.min}
    max={field.max}
    step={field.step}
    format={field.format}
    onValueChange={onValueChange}
  >
    <NumberFieldGroup>
      <NumberFieldInput
        aria-label={label}
        placeholder={
          placeholder === undefined
            ? undefined
            : new Intl.NumberFormat(undefined, field.format).format(placeholder)
        }
      />
    </NumberFieldGroup>
  </NumberField>
);

const asNumber = (value: FilterValue | undefined) =>
  value !== undefined && isNumber(value) ? value : null;

const asDay = (value: FilterValue | undefined) =>
  value !== undefined && isText(value) ? parseDayKey(value) : undefined;

const NumberEditor = ({ field }: { field: FilterField }) => {
  const rule = field.rule ?? createRule(field.type);
  const [first, second] = rule.values;
  const start = asNumber(first);
  const end = asNumber(second);

  if (!isRangeOperator(rule.operator)) {
    return (
      <NumberInput
        field={field}
        label={field.label}
        value={start}
        onValueChange={(value) => {
          setValues(field, [value]);
        }}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-related">
      <NumberInput
        field={field}
        label={`${field.label} from`}
        value={start}
        placeholder={field.min ?? field.range?.[0]}
        onValueChange={(value) => {
          setValues(field, [value, end]);
        }}
      />
      <NumberInput
        field={field}
        label={`${field.label} to`}
        value={end}
        placeholder={field.max ?? field.range?.[1]}
        onValueChange={(value) => {
          setValues(field, [start, value]);
        }}
      />
    </div>
  );
};

const DateEditor = ({ field }: { field: FilterField }) => {
  const rule = field.rule ?? createRule(field.type);
  const [first, second] = rule.values;

  if (!isRangeOperator(rule.operator)) {
    return (
      <Calendar
        mode="single"
        defaultMonth={asDay(first)}
        selected={asDay(first)}
        onSelect={(selected: Date | undefined) => {
          setValues(field, selected === undefined ? [] : [formatDayKey(selected)]);
        }}
      />
    );
  }

  return (
    <Calendar
      mode="range"
      defaultMonth={asDay(first)}
      selected={{ from: asDay(first), to: asDay(second) }}
      onSelect={(selected: DateRange | undefined) => {
        setValues(field, [
          selected?.from === undefined ? null : formatDayKey(selected.from),
          selected?.to === undefined ? null : formatDayKey(selected.to),
        ]);
      }}
    />
  );
};

/** The editor for a text, number or date field's value. Render inside a popover. */
const FilterValueEditor = ({ field }: { field: FilterField }) => {
  if (field.type === "number") {
    return <NumberEditor field={field} />;
  }

  if (field.type === "date") {
    return <DateEditor field={field} />;
  }

  if (field.type !== "text") {
    return null;
  }

  const [value] = field.rule?.values ?? [];

  return (
    <Input
      aria-label={field.label}
      placeholder={field.placeholder ?? "Enter text…"}
      value={value !== undefined && isText(value) ? value : ""}
      onChange={(event) => {
        setValues(field, [event.target.value]);
      }}
    />
  );
};

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
 * Opens a field's value editor from a trigger: a searchable menu for option fields, a popover for
 * the others. A text, number or date filter left without a value is removed when it closes.
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
      <DropdownMenu searchable open={open} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger render={trigger} />
        <DropdownMenuContent align={align} className="w-60">
          <FilterOptionMenu field={field} />
          {footer}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (!next && field.rule !== undefined && isRuleEmpty(field.rule)) {
          removeRule(field);
        }

        onOpenChange?.(next);
      }}
    >
      <PopoverTrigger render={trigger} />
      <PopoverContent align={align} className={field.type === "date" ? "w-auto" : "w-64"}>
        <FilterValueEditor field={field} />
        {footer}
      </PopoverContent>
    </Popover>
  );
};

/**
 * A value control for a trigger that shows the field's summary. When the summary counts the chosen
 * options ("3 selected"), hovering or focusing the trigger names them all in a tooltip.
 */
const SummaryValueControl = ({ trigger, ...props }: FilterValueControlProps) => {
  const values = countedValues(props.field);

  // The tooltip is always mounted and only disabled, so the trigger keeps its element (and an open
  // menu keeps its anchor) when choosing one more option turns the names into a count.
  return (
    <Tooltip disabled={values === null}>
      <FilterValueControl {...props} trigger={<TooltipTrigger render={trigger} />} />
      <TooltipContent>{values}</TooltipContent>
    </Tooltip>
  );
};

// Chip mode

/** The menu that changes a filter's operator. */
const FilterOperatorMenu = ({ field }: { field: FilterField }) => {
  const { rule } = field;

  if (rule === undefined) {
    return null;
  }

  const count = rule.values.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="sm" className="text-muted-foreground" />}
      >
        {getOperatorLabel(field.type, rule.operator, count)}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup
          value={rule.operator}
          onValueChange={(operator) => {
            if (isFilterOperator(operator)) {
              field.setRule(changeOperator(rule, operator));
            }
          }}
        >
          {filterOperators[field.type].map((operator) => (
            <DropdownMenuRadioItem key={operator} value={operator}>
              {getOperatorLabel(field.type, operator, count)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
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
const FilterChip = ({ field, open, onOpenChange, className }: FilterChipProps) => {
  const summary = summarize(field);

  return (
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
      <SummaryValueControl
        field={field}
        open={open}
        onOpenChange={onOpenChange}
        trigger={
          <Button variant="outline" size="sm" className="max-w-56">
            <span className={cn("truncate", summary === null && "text-muted-foreground")}>
              {summary ?? "Choose…"}
            </span>
          </Button>
        }
      />
      <Button
        variant="outline"
        size="icon-sm"
        aria-label={`Remove ${field.label} filter`}
        onClick={() => {
          removeRule(field);
        }}
      >
        <Icon name="x" aria-hidden="true" />
      </Button>
    </ButtonGroup>
  );
};

interface FilterMenuProps {
  filters: Filters;
  /** Called with a text, number or date field just added, so its value editor can open. */
  onFieldAdded?: (id: string) => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * The searchable menu that adds filters. Option fields open a searchable submenu of their
 * options; the other fields add an empty filter and hand off to its value editor.
 */
const FilterMenu = ({ filters, onFieldAdded, className, children = "Filter" }: FilterMenuProps) => {
  // The field to open once the menu has closed and returned focus to its trigger.
  const added = React.useRef<string | null>(null);

  return (
    <DropdownMenu
      searchable
      onOpenChangeComplete={(open) => {
        if (!open && added.current !== null) {
          onFieldAdded?.(added.current);
          added.current = null;
        }
      }}
    >
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" className={className} />}>
        <Icon name="list-filter" aria-hidden="true" data-icon="inline-start" />
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60">
        <DropdownMenuSearch aria-label="Search fields" placeholder="Filter by…" />
        <DropdownMenuEmpty>No fields found.</DropdownMenuEmpty>
        <DropdownMenuList>
          {filters.fields.map((field) => {
            const icon =
              field.icon === undefined ? null : <Icon name={field.icon} aria-hidden="true" />;

            if (isOptionType(field.type)) {
              return (
                <DropdownMenuSub key={field.id} searchable>
                  <DropdownMenuSubTrigger label={field.label} className="gap-related">
                    {icon}
                    {field.label}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-60">
                    <FilterOptionMenu field={field} />
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              );
            }

            return (
              <DropdownMenuItem
                key={field.id}
                label={field.label}
                className="gap-related"
                onClick={() => {
                  if (field.rule === undefined) {
                    field.setRule(createRule(field.type));
                  }

                  added.current = field.id;
                }}
              >
                {icon}
                {field.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuList>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface FilterBarProps extends Omit<React.ComponentProps<"div">, "children"> {
  filters: Filters;
  /** Content after the chips, such as a search input or view options. */
  children?: React.ReactNode;
}

/** Chip mode: an add-filter menu, a chip for each active filter, and a clear action. */
const FilterBar = ({ filters, className, children, ...props }: FilterBarProps) => {
  const [openId, setOpenId] = React.useState<string | null>(null);

  return (
    <div
      data-slot="filter-bar"
      className={cn("flex min-w-0 flex-wrap items-center gap-related", className)}
      {...props}
    >
      <FilterMenu filters={filters} onFieldAdded={setOpenId} />
      {filters.active.map((field) => (
        <FilterChip
          key={field.id}
          field={field}
          open={isOptionType(field.type) ? undefined : openId === field.id}
          onOpenChange={(open) => {
            setOpenId(open ? field.id : null);
          }}
        />
      ))}
      {filters.active.length === 0 ? null : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            filters.clear();
          }}
        >
          Clear
        </Button>
      )}
      {children}
    </div>
  );
};

// Faceted mode

const FacetSummary = ({ field }: { field: FilterField }) => {
  const chosen = field.rule?.values ?? [];

  if (!isOptionType(field.type) || isCounted(field)) {
    return (
      <Badge variant="secondary" className="max-w-40">
        <span className="truncate">{summarize(field)}</span>
      </Badge>
    );
  }

  return chosen.map((value) => (
    <Badge key={String(value)} variant="secondary">
      {formatValue(field, value)}
    </Badge>
  ));
};

const FacetClear = ({ field }: { field: FilterField }) => {
  if (!isOptionType(field.type)) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          removeRule(field);
        }}
      >
        Clear filter
      </Button>
    );
  }

  return (
    // A searchable menu has no popup padding (its list pads itself), so the footer pads itself
    // the same way and draws a full-width separator, as the search header does.
    <div data-slot="filter-facet-footer" className="shrink-0">
      <Separator variant="full" />
      <div className="p-1">
        <DropdownMenuItem
          className="justify-center"
          onClick={() => {
            removeRule(field);
          }}
        >
          Clear filter
        </DropdownMenuItem>
      </div>
    </div>
  );
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
  const active = field.rule !== undefined && !isRuleEmpty(field.rule);

  return (
    <SummaryValueControl
      field={field}
      footer={active ? <FacetClear field={field} /> : null}
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
              <FacetSummary field={field} />
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            filters.clear();
          }}
        >
          Reset
          <Icon name="x" aria-hidden="true" data-icon="inline-end" />
        </Button>
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
  FilterOptionItems,
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
