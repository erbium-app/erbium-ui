import * as React from "react";
import { Menu } from "@base-ui/react/menu";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vite-plus/test";
import { Cascader } from "../cascader";
import type { CascaderRow } from "../cascader";
import { Filters, useFieldPicker, useFilterField, useListFilters, useOptionPicker } from "./index";
import type { FieldPickerData, FilterState, ListFilterField } from "./index";

interface Task {
  title: string;
  status: string;
  estimate: number;
}

const tasks: Task[] = [
  { estimate: 2, status: "open", title: "Write docs" },
  { estimate: 5, status: "paid", title: "Fix API" },
  { estimate: 8, status: "open", title: "Ship API" },
];

const fields = {
  estimate: { label: "Estimate", type: "number", value: (task: Task) => task.estimate },
  status: {
    label: "Status",
    options: [
      { label: "Open", value: "open" },
      { label: "Paid", value: "paid" },
    ],
    type: "option",
    value: (task: Task) => task.status,
  },
  title: { label: "Title", type: "text", value: (task: Task) => task.title },
} satisfies Record<string, ListFilterField<Task>>;

const Titles = ({ items }: { items: Task[] }) => (
  <output aria-label="Results">{items.map((task) => task.title).join(", ")}</output>
);

const OperatorMenu = () => {
  const { field, operators } = useFilterField();

  return (
    <Menu.Root>
      <Menu.Trigger>{`${field.label} operator`}</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Filters.Operator>
              {operators.map((operator) => (
                <Filters.OperatorItem key={operator} operator={operator}>
                  {operator}
                </Filters.OperatorItem>
              ))}
            </Filters.Operator>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
};

const FieldPicker = ({
  filters,
  onFieldAdded,
}: {
  filters: Filters;
  onFieldAdded: (id: string) => void;
}) => {
  const picker = useFieldPicker(filters, { onFieldAdded });

  return (
    <Cascader.Root multiple searchable {...picker}>
      <Cascader.Trigger>Add filter</Cascader.Trigger>
      <Cascader.Portal>
        <Cascader.Positioner>
          <Cascader.Popup>
            <Cascader.Search />
            <Cascader.List>
              <Cascader.Level>
                <Cascader.Rows>
                  {(row: CascaderRow<FieldPickerData>) => (
                    <Cascader.Item row={row}>
                      {row.node.label}
                      {row.node.data?.count === undefined ? null : ` (${row.node.data.count})`}
                    </Cascader.Item>
                  )}
                </Cascader.Rows>
              </Cascader.Level>
            </Cascader.List>
          </Cascader.Popup>
        </Cascader.Positioner>
      </Cascader.Portal>
    </Cascader.Root>
  );
};

const OptionPicker = () => {
  const { field } = useFilterField();
  const picker = useOptionPicker(field);

  return (
    <Cascader.Root multiple {...picker}>
      <Cascader.Trigger>{`${field.label} options`}</Cascader.Trigger>
      <Cascader.Portal>
        <Cascader.Positioner>
          <Cascader.Popup>
            <Cascader.List>
              <Cascader.Level>
                <Cascader.Rows>
                  {(row) => <Cascader.Item row={row}>{row.node.label}</Cascader.Item>}
                </Cascader.Rows>
              </Cascader.Level>
            </Cascader.List>
          </Cascader.Popup>
        </Cascader.Positioner>
      </Cascader.Portal>
    </Cascader.Root>
  );
};

const ignoreAdded = (_id: string) => {};

const Board = ({ onFieldAdded = ignoreAdded }: { onFieldAdded?: (id: string) => void }) => {
  const { filters, items } = useListFilters({ fields, items: tasks });

  return (
    <Filters.Root filters={filters}>
      <FieldPicker filters={filters} onFieldAdded={onFieldAdded} />
      {filters.active.map((field) => (
        <Filters.Field key={field.id} id={field.id}>
          <fieldset aria-label={`${field.label} filter`}>
            {field.type === "option" ? <OptionPicker /> : <OperatorMenu />}
            {field.type === "text" ? <Filters.Value /> : null}
            {field.type === "number" ? (
              <>
                <Filters.Value index={0} aria-label="From" />
                <Filters.Value index={1} aria-label="To" />
              </>
            ) : null}
            <Filters.Remove />
          </fieldset>
        </Filters.Field>
      ))}
      <Filters.Clear>Clear</Filters.Clear>
      <Titles items={items} />
    </Filters.Root>
  );
};

const results = () => screen.getByRole("status", { name: "Results" }).textContent;

const openPicker = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { name: "Add filter" }));
  await screen.findByRole("menu");
};

describe("Filters with a list", () => {
  it("adds a text filter from the picker, then hands off once the picker has closed", async () => {
    const user = userEvent.setup();
    const onFieldAdded = vi.fn<(id: string) => void>();

    render(<Board onFieldAdded={onFieldAdded} />);
    await openPicker(user);
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Title" }));

    await waitFor(() => {
      expect(onFieldAdded).toHaveBeenCalledWith("title");
    });
    expect(screen.queryByRole("menu")).toBeNull();

    await user.type(screen.getByRole("textbox", { name: "Title" }), "api");
    expect(results()).toBe("Fix API, Ship API");

    await user.click(screen.getByRole("button", { name: "Remove Title filter" }));
    expect(results()).toBe("Write docs, Fix API, Ship API");
  });

  it("toggles options from the field picker with their counts", async () => {
    const user = userEvent.setup();

    render(<Board />);
    await openPicker(user);
    await user.click(screen.getByRole("menuitem", { name: "Status" }));
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Paid (1)" }));

    expect(results()).toBe("Fix API");
    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("binds number values and operators, and clears every rule", async () => {
    const user = userEvent.setup();

    render(<Board />);
    await openPicker(user);
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Estimate" }));
    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeNull();
    });

    await user.click(screen.getByRole("button", { name: "Estimate operator" }));
    await user.click(await screen.findByRole("menuitemradio", { name: "between" }));
    await user.type(screen.getByRole("spinbutton", { name: "From" }), "3");
    expect(results()).toBe("Fix API, Ship API");

    await user.type(screen.getByRole("spinbutton", { name: "To" }), "6");
    expect(results()).toBe("Fix API");

    await user.clear(screen.getByRole("spinbutton", { name: "From" }));
    expect(results()).toBe("Write docs, Fix API");

    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(results()).toBe("Write docs, Fix API, Ship API");
    expect(screen.getByRole("button", { name: "Clear" }).hasAttribute("disabled")).toBe(true);
  });

  it("removes an option rule when its last option is unchecked", async () => {
    const user = userEvent.setup();

    render(<Board />);
    await openPicker(user);
    await user.click(screen.getByRole("menuitem", { name: "Status" }));
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Open (2)" }));
    await user.keyboard("{Escape}");

    await user.click(screen.getByRole("button", { name: "Status options" }));
    await user.click(await screen.findByRole("menuitemcheckbox", { name: "Open" }));

    expect(screen.queryByRole("group", { name: "Status filter" })).toBeNull();
    expect(results()).toBe("Write docs, Fix API, Ship API");
  });
});

const StateField = () => {
  const { filters } = useListFilters({
    defaultValue: [{ id: "title", value: { operator: "is", type: "text", values: [] } }],
    fields,
    items: tasks,
  });

  return (
    <Filters.Root filters={filters}>
      <Filters.Field id="title">
        <Filters.Remove data-testid="remove" />
      </Filters.Field>
      <Filters.Field id="missing">
        <span>never</span>
      </Filters.Field>
    </Filters.Root>
  );
};

const Controlled = () => {
  const [state, setState] = React.useState<FilterState>([
    {
      id: "title",
      value: { operator: "contains", type: "text", values: [] },
    },
  ]);

  const { filters, items } = useListFilters({
    fields,
    items: tasks,
    onValueChange: (updater) => {
      setState((last) => (Array.isArray(updater) ? updater : updater(last)));
    },
    value: state,
  });

  return (
    <Filters.Root filters={filters}>
      <Filters.Field id="title">
        <Filters.Value />
      </Filters.Field>
      <Titles items={items} />
    </Filters.Root>
  );
};

describe("Filters parts", () => {
  it("expose the field's state as data attributes", () => {
    render(<StateField />);
    const remove = screen.getByTestId("remove");

    expect(remove.dataset.type).toBe("text");
    expect(remove.dataset.operator).toBe("is");
    expect(Object.hasOwn(remove.dataset, "active")).toBe(true);
    expect(Object.hasOwn(remove.dataset, "empty")).toBe(true);
    expect(screen.queryByText("never")).toBeNull();
  });

  it("throws a named error outside a field", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Filters.Remove />)).toThrow(
      "Filters.Remove must be placed within <Filters.Field>.",
    );
  });

  it("updates a controlled list through its change handler", async () => {
    const user = userEvent.setup();

    render(<Controlled />);
    await user.type(screen.getByRole("textbox", { name: "Title" }), "docs");

    await waitFor(() => {
      expect(results()).toBe("Write docs");
    });
  });
});
