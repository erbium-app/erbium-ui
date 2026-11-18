import * as React from "react";
import { Menu } from "@base-ui/react/menu";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { missingContext } from "../internal/dom";
import { filterOperators, getFieldActions, isFilterOperator, isRuleEmpty } from "./rules";
import type { FilterField, FilterFieldActions, FilterOperator, Filters } from "./rules";

// Contexts

const FiltersContext = React.createContext<Filters | null>(null);

interface FilterFieldContextValue {
  field: FilterField;
  actions: FilterFieldActions;
}

const FilterFieldContext = React.createContext<FilterFieldContextValue | null>(null);

/** The filters of the surrounding `Filters.Root`. */
const useFilters = (): Filters =>
  React.use(FiltersContext) ?? missingContext("useFilters", "<Filters.Root>");

interface UseFilterFieldReturnValue extends FilterFieldContextValue {
  /** The operators of the field's type, in order. */
  operators: readonly FilterOperator[];
  /** The field has no rule, or a rule without values. */
  empty: boolean;
}

/** The field of the surrounding `Filters.Field`, its rule actions and its operators. */
const useFilterField = (): UseFilterFieldReturnValue => {
  const { actions, field } =
    React.use(FilterFieldContext) ?? missingContext("useFilterField", "<Filters.Field>");

  return {
    actions,
    empty: field.rule === undefined || isRuleEmpty(field.rule),
    field,
    operators: filterOperators[field.type],
  };
};

const useFieldContext = (part: string) =>
  React.use(FilterFieldContext) ?? missingContext(part, "<Filters.Field>");

/** The state Field-scoped parts expose as data attributes. */
interface FilterFieldState extends Record<string, unknown> {
  type: FilterField["type"];
  /** The rule's operator, or the field type's default operator while it has no rule. */
  operator: FilterOperator;
  /** The field has a rule. */
  active: boolean;
  /** The rule has no values yet, or the field has no rule. */
  empty: boolean;
}

const fieldState = (field: FilterField): FilterFieldState => ({
  active: field.rule !== undefined,
  empty: field.rule === undefined || isRuleEmpty(field.rule),
  operator: field.rule?.operator ?? filterOperators[field.type][0],
  type: field.type,
});

// Root

interface FiltersRootProps {
  /** The filters, from `useTableFilters`, `useListFilters` or `createFilters`. */
  filters: Filters;
  children?: React.ReactNode;
}

/** Provides one set of filters to the parts inside it. Renders no element. */
const FiltersRoot = ({ filters, children }: FiltersRootProps) => (
  <FiltersContext value={filters}>{children}</FiltersContext>
);

// Field

interface FiltersFieldProps {
  /** The field's id inside `Filters.Root`. */
  id?: string;
  /** The field itself, to use the parts without a root. */
  field?: FilterField;
  children?: React.ReactNode;
}

const FieldScope = ({ field, children }: { field: FilterField; children: React.ReactNode }) => {
  const value = React.useMemo(() => ({ actions: getFieldActions(field), field }), [field]);

  return <FilterFieldContext value={value}>{children}</FilterFieldContext>;
};

/** Scopes the parts inside it to one field. Renders no element, and nothing for an unknown id. */
const FiltersField = ({ id, field: fieldProp, children }: FiltersFieldProps) => {
  const filters = React.use(FiltersContext);
  const field = fieldProp ?? filters?.fields.find((candidate) => candidate.id === id);

  if (field === undefined) {
    if (filters === null) {
      throw new Error("Filters.Field needs a `field`, or an `id` inside <Filters.Root>.");
    }

    return null;
  }

  return <FieldScope field={field}>{children}</FieldScope>;
};

// Operator

/**
 * The field's operator as Base UI's `Menu.RadioGroup`: render it in a menu popup with an item for
 * each operator. Changing the operator keeps the values that still apply.
 */
const FiltersOperator = (props: Omit<Menu.RadioGroup.Props, "value" | "defaultValue">) => {
  const { actions, field } = useFieldContext("Filters.Operator");

  return (
    <Menu.RadioGroup
      value={fieldState(field).operator}
      onValueChange={(value: string) => {
        if (isFilterOperator(value)) {
          actions.setOperator(value);
        }
      }}
      {...props}
    />
  );
};

interface FiltersOperatorItemProps extends Omit<Menu.RadioItem.Props, "value"> {
  operator: FilterOperator;
}

/** One operator, as Base UI's `Menu.RadioItem`. */
const FiltersOperatorItem = ({ operator, ...props }: FiltersOperatorItemProps) => (
  <Menu.RadioItem value={operator} {...props} />
);

// Value

/** A typed number, or `null` for a blank or unreadable one. */
const parseNumber = (text: string) => {
  const parsed = text.trim() === "" ? Number.NaN : Number(text);

  return Number.isFinite(parsed) ? parsed : null;
};

interface FiltersValueProps extends Omit<
  useRender.ComponentProps<"input", FilterFieldState>,
  "value" | "defaultValue" | "type"
> {
  /** Which value the input edits: 0, or 1 for the end of a range. */
  index?: number;
}

/**
 * An `<input>` bound to one value of a text or number field. Text writes strings; number parses
 * the input, and a blank or unreadable number writes `null`. For richer controls, bind them to
 * `useFilterField().actions.setValue`.
 */
const FiltersValue = ({ index = 0, render, ...props }: FiltersValueProps) => {
  const { actions, field } = useFieldContext("Filters.Value");
  const value = field.rule?.values[index] ?? null;
  const number = field.type === "number";

  return useRender({
    defaultTagName: "input",
    props: mergeProps<"input">(
      {
        "aria-label": field.label,
        inputMode: number ? "decimal" : undefined,
        onChange: (event) => {
          const text = event.currentTarget.value;

          actions.setValue(index, number ? parseNumber(text) : text);
        },
        type: number ? "number" : "text",
        value: value === null ? "" : String(value),
      },
      props,
    ),
    render,
    state: fieldState(field),
  });
};

// Remove and clear

/** Removes the field's rule. Its default name is "Remove <field> filter". */
const FiltersRemove = ({
  render,
  ...props
}: useRender.ComponentProps<"button", FilterFieldState>) => {
  const { actions, field } = useFieldContext("Filters.Remove");

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        "aria-label": `Remove ${field.label} filter`,
        onClick: () => {
          actions.remove();
        },
        type: "button",
      },
      props,
    ),
    render,
    state: fieldState(field),
  });
};

/** Removes every rule the root owns. Disabled while there are none. */
const FiltersClear = ({ render, ...props }: useRender.ComponentProps<"button">) => {
  const filters = useFilters();
  const empty = filters.active.length === 0;

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        disabled: empty,
        onClick: () => {
          filters.clear();
        },
        type: "button",
      },
      props,
    ),
    render,
    state: { disabled: empty },
  });
};

export {
  FiltersClear,
  FiltersField,
  FiltersOperator,
  FiltersOperatorItem,
  FiltersRemove,
  FiltersRoot,
  FiltersValue,
  useFilterField,
  useFilters,
};

export type {
  FilterFieldState,
  FiltersFieldProps,
  FiltersOperatorItemProps,
  FiltersRootProps,
  FiltersValueProps,
  UseFilterFieldReturnValue,
};
