import * as React from "react";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { ButtonGroup } from "../components/button-group";
import { Calendar } from "../components/calendar";
import type { DateRange } from "../components/calendar";
import {
  Cascader,
  CascaderClear,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderSearch,
} from "../components/cascader";
import type { CascaderNode } from "../components/cascader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
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
  findOption,
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
import type { FilterField, FilterOption, FilterValue, Filters } from "../lib/filter-rules";
import { buttonVariants } from "../lib/button-variants";
import { cn } from "../lib/utils";

/*
 * Filter components. Every layout here reads the same `Filters` (from `useTableFilters` or
 * `useListFilters`) and edits values with the same controls: option fields in a searchable
 * cascader, whose option trees open level by level in one popup, and text, number and date fields
 * in a popover. The layouts differ only in how they present fields.
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

  return findOption(field.options, String(value))?.label ?? String(value);
};

/** The labels of an option field's chosen options, in the order they were chosen. */
const optionLabels = (field: FilterField): string[] =>
  isOptionType(field.type)
    ? (field.rule?.values ?? []).map((value) => formatValue(field, value) ?? "")
    : [];

/** Past this many chosen options, a summary counts them instead of naming them. */
const namedOptionLimit = 2;

const isCounted = (field: FilterField) => optionLabels(field).length > namedOptionLimit;

/** What a field's value reads as in a chip or facet button, or `null` while it has none. */
const summarize = (field: FilterField): string | null => {
  const { rule } = field;

  if (rule === undefined || isRuleEmpty(rule)) {
    return null;
  }

  if (isOptionType(field.type)) {
    const labels = optionLabels(field);

    return isCounted(field) ? `${labels.length} selected` : labels.join(", ");
  }

  const [first, second] = rule.values;

  if (isRangeOperator(rule.operator)) {
    return `${formatValue(field, first) ?? "…"} – ${formatValue(field, second) ?? "…"}`;
  }

  return field.type === "text" ? `“${first ?? ""}”` : formatValue(field, first);
};

// Option trees

/** The chosen option values of a field's rule. */
const chosenValues = (field: FilterField) =>
  (field.rule?.values ?? []).flatMap((value) => (value === null ? [] : [String(value)]));

/** Calls `visit` for each option that can be chosen: the options without children. */
const forEachLeaf = (options: readonly FilterOption[], visit: (option: FilterOption) => void) => {
  for (const option of options) {
    if (option.children === undefined) {
      visit(option);
    } else {
      forEachLeaf(option.children, visit);
    }
  }
};

/** An option tree as cascader nodes, each keyed by `nodeValue`. */
const toOptionNodes = (
  options: readonly FilterOption[],
  nodeValue: (option: FilterOption) => string,
): CascaderNode[] =>
  options.map((option) => ({
    children: option.children === undefined ? undefined : toOptionNodes(option.children, nodeValue),
    icon: option.icon === undefined ? undefined : <Icon name={option.icon} aria-hidden="true" />,
    keywords: option.keywords,
    label: option.label,
    value: nodeValue(option),
  }));

/** The content of an option row, with the option's count when the field has counts. */
const OptionRow = ({ node, count }: { node: CascaderNode; count: number | undefined }) => (
  <>
    {node.icon}
    <span className="truncate">{node.label}</span>
    {count === undefined ? null : (
      <span className="ms-auto ps-4 text-muted-foreground tabular-nums">{count}</span>
    )}
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
  const { counts, options } = field;
  const items = React.useMemo(() => toOptionNodes(options, (option) => option.value), [options]);

  // The tooltip is always mounted and only disabled, so the trigger keeps its element (and an
  // open menu keeps its anchor) when one more chosen option turns the names into a count.
  return (
    <Tooltip disabled={!isCounted(field)}>
      <Cascader
        multiple
        searchable
        items={items}
        value={chosenValues(field)}
        open={open}
        onOpenChange={onOpenChange}
        onValueChange={(values) => {
          if (values.length === 0) {
            field.setRule(undefined);
          } else {
            setValues(field, values);
          }
        }}
      >
        <DropdownMenuTrigger render={<TooltipTrigger render={trigger} />} />
        <CascaderContent align={align} className="w-64">
          <CascaderSearch
            aria-label={`Search ${field.label}`}
            placeholder={`Search ${field.label.toLocaleLowerCase()}…`}
          />
          <CascaderEmpty>No options found.</CascaderEmpty>
          <CascaderList>
            {(node) => (
              <OptionRow
                node={node}
                count={
                  counts === undefined || node.children !== undefined
                    ? undefined
                    : (counts.get(node.value) ?? 0)
                }
              />
            )}
          </CascaderList>
          {footer}
        </CascaderContent>
      </Cascader>
      <TooltipContent>{optionLabels(field).join(", ")}</TooltipContent>
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

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (!next && field.rule !== undefined && isRuleEmpty(field.rule)) {
          field.setRule(undefined);
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
      <FilterValueControl
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
          field.setRule(undefined);
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

/** The menu value of a field, or of one of its options. JSON keeps any id and value apart. */
const menuValue = (id: string, option?: string) =>
  JSON.stringify(option === undefined ? [id] : [id, option]);

interface MenuTarget {
  field: FilterField;
  /** The option a row chooses, or none for a field row. */
  option?: string;
}

/**
 * The fields as the top level of the add-filter menu. An option field opens its option tree; a
 * text, number or date field is a row of its own, checked while the field has a filter.
 */
const toFieldTree = (fields: readonly FilterField[]) => {
  const targets = new Map<string, MenuTarget>();
  const counts = new Map<string, number>();
  const selected: string[] = [];

  const items = fields.map((field): CascaderNode => {
    const value = menuValue(field.id);

    const icon =
      field.icon === undefined ? undefined : <Icon name={field.icon} aria-hidden="true" />;

    targets.set(value, { field });

    if (!isOptionType(field.type)) {
      if (field.rule !== undefined) {
        selected.push(value);
      }

      return { icon, label: field.label, value };
    }

    forEachLeaf(field.options, (option) => {
      const key = menuValue(field.id, option.value);

      targets.set(key, { field, option: option.value });

      if (field.counts !== undefined) {
        counts.set(key, field.counts.get(option.value) ?? 0);
      }
    });

    for (const chosen of chosenValues(field)) {
      selected.push(menuValue(field.id, chosen));
    }

    return {
      children: toOptionNodes(field.options, (option) => menuValue(field.id, option.value)),
      icon,
      label: field.label,
      value,
    };
  });

  return { counts, items, selected, targets };
};

/**
 * The searchable menu that adds filters, built on the cascader. Option fields open their options
 * in place, and the search finds fields and options at any depth. Text, number and date fields
 * add an empty filter and hand off to its value editor.
 */
const FilterMenu = ({ filters, onFieldAdded, className, children = "Filter" }: FilterMenuProps) => {
  const [open, setOpen] = React.useState(false);
  // The field to open once the menu has closed and returned focus to its trigger.
  const added = React.useRef<string | null>(null);
  const { counts, items, selected, targets } = toFieldTree(filters.fields);

  return (
    <Cascader
      multiple
      searchable
      items={items}
      value={selected}
      open={open}
      onOpenChange={setOpen}
      onOpenChangeComplete={(next) => {
        if (!next && added.current !== null) {
          onFieldAdded?.(added.current);
          added.current = null;
        }
      }}
      onValueChange={(values, { node }) => {
        const target = node === null ? undefined : targets.get(node.value);

        if (node === null || target === undefined) {
          return;
        }

        const checked = values.includes(node.value);
        const { field, option } = target;

        if (option !== undefined) {
          toggleOption(field, option, checked);
        } else if (checked) {
          if (field.rule === undefined) {
            field.setRule(createRule(field.type));
          }

          added.current = field.id;
          setOpen(false);
        } else {
          field.setRule(undefined);
        }
      }}
    >
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" className={className} />}>
        <Icon name="list-filter" aria-hidden="true" data-icon="inline-start" />
        {children}
      </DropdownMenuTrigger>
      <CascaderContent className="w-64">
        <CascaderSearch aria-label="Search filters" placeholder="Filter by…" />
        <CascaderEmpty>No filters found.</CascaderEmpty>
        <CascaderList>
          {(node) => <OptionRow node={node} count={counts.get(node.value)} />}
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
          field.setRule(undefined);
        }}
      >
        Clear filter
      </Button>
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
  const active = field.rule !== undefined && !isRuleEmpty(field.rule);

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
