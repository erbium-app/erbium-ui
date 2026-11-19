import * as React from "react";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vite-plus/test";
import { Cascader } from "./index";
import type { CascaderNode, CascaderRootMultipleProps, CascaderRootSingleProps } from "./index";

const tree: CascaderNode[] = [
  {
    children: [
      {
        children: [
          { label: "Berlin", value: "berlin" },
          { keywords: ["München"], label: "Munich", value: "munich" },
        ],
        label: "Germany",
        value: "germany",
      },
      { children: [{ label: "Paris", value: "paris" }], label: "France", value: "france" },
    ],
    label: "Europe",
    value: "europe",
  },
  { label: "Antarctica", value: "antarctica" },
  { disabled: true, label: "Atlantis", value: "atlantis" },
];

type FixtureProps = (
  | Omit<CascaderRootSingleProps, "items">
  | Omit<CascaderRootMultipleProps, "items">
) & { withClear?: boolean };

type SingleChange = NonNullable<CascaderRootSingleProps["onValueChange"]>;

type MultipleChange = NonNullable<CascaderRootMultipleProps["onValueChange"]>;

const Fixture = ({ withClear = false, ...props }: FixtureProps) => (
  <Cascader.Root items={tree} {...props}>
    <Cascader.Trigger>
      <Cascader.Value placeholder="Pick a place" />
    </Cascader.Trigger>
    <Cascader.Portal>
      <Cascader.Positioner>
        <Cascader.Popup aria-label="Places">
          {props.searchable === true ? (
            <>
              <Cascader.SearchGroup data-testid="search-group">
                <Cascader.Back />
                <Cascader.Search />
              </Cascader.SearchGroup>
              <Cascader.Empty>No results</Cascader.Empty>
            </>
          ) : null}
          <Cascader.List>
            <Cascader.BackItem>Back</Cascader.BackItem>
            <Cascader.Level>
              <Cascader.LevelLabel />
              <Cascader.Rows>
                {(row) => (
                  <Cascader.Item row={row}>
                    <Cascader.ItemIndicator data-testid={`indicator-${row.node.value}`} />
                    {row.node.label}
                    <Cascader.ItemTrail
                      fallback="Direct option"
                      data-testid={`trail-${row.node.value}`}
                    />
                    <Cascader.ItemCount data-testid={`count-${row.node.value}`} />
                  </Cascader.Item>
                )}
              </Cascader.Rows>
            </Cascader.Level>
          </Cascader.List>
          {withClear ? <Cascader.Clear>Clear</Cascader.Clear> : null}
        </Cascader.Popup>
      </Cascader.Positioner>
    </Cascader.Portal>
  </Cascader.Root>
);

const trigger = () =>
  screen.getByRole("button", { name: /pick a place|\/|,|berlin|munich|paris|antarctica/iu });

const itemRoles = ["menuitem", "menuitemradio", "menuitemcheckbox"] as const;

const queryItem = (name: string) =>
  itemRoles
    .flatMap((role) => screen.queryAllByRole(role, { name: new RegExp(`^${name}`, "u") }))
    .at(0) ?? null;

const item = (name: string) => {
  const found = queryItem(name);

  if (found === null) {
    throw new Error(`No menu item named ${name}`);
  }

  return found;
};

const openMenu = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(trigger());
  await screen.findByRole("menu");
};

describe("Cascader single", () => {
  it("opens levels in place and selects a leaf with its path", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<SingleChange>();

    render(<Fixture onValueChange={onValueChange} />);
    await openMenu(user);

    await user.click(item("Europe"));
    expect(item("Germany")).toBeDefined();
    await user.click(item("Germany"));
    await user.click(item("Berlin"));

    expect(onValueChange).toHaveBeenCalledOnce();
    const [value, details] = onValueChange.mock.calls[0] ?? [];
    expect({
      path: details?.path.map((node) => node.value),
      reason: details?.reason,
      value,
    }).toStrictEqual({
      path: ["europe", "germany", "berlin"],
      reason: "item-press",
      value: "berlin",
    });
    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeNull();
    });
    expect(trigger().textContent).toBe("Europe / Germany / Berlin");
  });

  it("passes the original nodes to search, rows, value rendering and change details", async () => {
    interface Place extends CascaderNode {
      children?: Place[];
      code: string;
    }

    const leaf: Place = { code: "BER", label: "Berlin", value: "berlin" };

    const branch: Place = {
      children: [leaf],
      code: "DE",
      label: "Germany",
      value: "germany",
    };

    const onValueChange = vi.fn<NonNullable<CascaderRootSingleProps<Place>["onValueChange"]>>();

    const filter = vi.fn<(node: Place, query: string) => boolean>(
      (node, query) => node.code === query,
    );

    const user = userEvent.setup();

    render(
      <Cascader.Root items={[branch]} filter={filter} onValueChange={onValueChange} searchable>
        <Cascader.Trigger>
          <Cascader.Value<Place>>
            {({ paths }) => paths[0]?.map((node) => node.code).join(" / ") ?? "Pick a place"}
          </Cascader.Value>
        </Cascader.Trigger>
        <Cascader.Portal>
          <Cascader.Positioner>
            <Cascader.Popup>
              <Cascader.Search />
              <Cascader.List>
                <Cascader.Level>
                  <Cascader.Rows<Place>>
                    {(row) => <Cascader.Item row={row}>{row.node.code}</Cascader.Item>}
                  </Cascader.Rows>
                </Cascader.Level>
              </Cascader.List>
            </Cascader.Popup>
          </Cascader.Positioner>
        </Cascader.Portal>
      </Cascader.Root>,
    );

    await openMenu(user);
    await user.type(screen.getByRole("searchbox"), "BER");
    await user.click(await screen.findByRole("menuitemradio", { name: "BER" }));

    const details = onValueChange.mock.calls[0]?.[1];
    expect(filter.mock.calls.at(-1)?.[0]).toBe(leaf);
    expect(details?.node).toBe(leaf);
    expect(details?.path[0]).toBe(branch);
    expect(screen.getByRole("button", { name: "DE / BER" })).toBeDefined();
  });

  it("reopens on the level that holds the selection", async () => {
    const user = userEvent.setup();

    render(<Fixture defaultValue="munich" />);
    await openMenu(user);

    expect(item("Berlin")).toBeDefined();
    expect(item("Munich").getAttribute("aria-checked")).toBe("true");
  });

  it("marks branches that hold the selection and counts their options", async () => {
    const user = userEvent.setup();

    render(<Fixture defaultValue="paris" revealSelected={false} />);
    await openMenu(user);

    const europe = item("Europe");
    expect(europe.dataset.kind).toBe("branch");
    expect(Object.hasOwn(europe.dataset, "selected")).toBeTruthy();
    expect(screen.getByTestId("count-europe").textContent).toBe(
      "2, 2 options, holds the selection",
    );
    expect(item("Antarctica").dataset.kind).toBe("leaf");
  });

  it("keeps the value when a callback cancels the change", async () => {
    const user = userEvent.setup();

    render(
      <Fixture
        onValueChange={(_value, details) => {
          details.cancel();
        }}
      />,
    );
    await openMenu(user);
    await user.click(item("Antarctica"));

    expect(trigger().textContent).toBe("Pick a place");
  });

  it("does not select a disabled leaf", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<SingleChange>();

    render(<Fixture onValueChange={onValueChange} />);
    await openMenu(user);
    await user.click(item("Atlantis"));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("reports level changes and follows a controlled level", async () => {
    const user = userEvent.setup();
    const onLevelChange = vi.fn<(level: string[], reason: string) => void>();

    const Controlled = () => {
      const [level, setLevel] = React.useState<readonly string[]>([]);

      return (
        <Fixture
          level={level}
          onLevelChange={(next, details) => {
            onLevelChange(next, details.reason);
            setLevel(next);
          }}
        />
      );
    };

    render(<Controlled />);
    await openMenu(user);
    await user.click(item("Europe"));

    expect(onLevelChange).toHaveBeenLastCalledWith(["europe"], "branch-press");
    expect(item("Germany")).toBeDefined();

    await user.click(screen.getByRole("menuitem", { name: "Back" }));
    expect(onLevelChange).toHaveBeenLastCalledWith([], "back-press");
  });
});

describe("Cascader keyboard without search", () => {
  it("enters a branch with the forward arrow and returns with the back arrow", async () => {
    const user = userEvent.setup();

    render(<Fixture />);
    await openMenu(user);

    act(() => {
      item("Europe").focus();
    });
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(item("Germany"));

    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(item("Europe"));
  });

  it("mirrors the level keys in right-to-left text", async () => {
    const user = userEvent.setup();

    render(
      <DirectionProvider direction="rtl">
        <Fixture />
      </DirectionProvider>,
    );
    await openMenu(user);

    act(() => {
      item("Europe").focus();
    });
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(item("Germany"));

    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(item("Europe"));
  });
});

describe("Cascader search", () => {
  it("focuses the field from the search surface and tracks nested levels", async () => {
    const user = userEvent.setup();
    render(<Fixture searchable />);
    await openMenu(user);

    const group = screen.getByTestId("search-group");
    expect(Object.hasOwn(group.dataset, "nested")).toBeFalsy();
    await user.click(item("Europe"));
    expect(Object.hasOwn(group.dataset, "nested")).toBeTruthy();

    const search = screen.getByRole("searchbox", { name: "Search Europe" });
    act(() => {
      item("Germany").focus();
    });
    await user.click(group);
    expect(document.activeElement).toBe(search);

    await user.click(screen.getByRole("button", { name: "Back to all options" }));
    expect(Object.hasOwn(group.dataset, "nested")).toBeFalsy();
    expect(document.activeElement).toBe(search);
  });

  it("finds options below the level and shows their trail", async () => {
    const user = userEvent.setup();

    render(<Fixture searchable />);
    await openMenu(user);
    expect(screen.getByTestId("trail-antarctica").textContent).toBe("Direct option");
    await user.type(screen.getByRole("searchbox", { name: "Search options" }), "münch");

    await waitFor(() => {
      expect(item("Munich")).toBeDefined();
    });
    expect(queryItem("Berlin")).toBeNull();
    expect(screen.getByTestId("trail-munich").textContent).toBe("Europe / Germany");
    expect(Object.hasOwn(item("Munich").dataset, "searchResult")).toBeTruthy();
  });

  it("goes back with Backspace in an empty field and names the level", async () => {
    const user = userEvent.setup();

    render(<Fixture searchable />);
    await openMenu(user);
    await user.click(item("Europe"));

    const search = screen.getByRole("searchbox", { name: "Search Europe" });
    expect(screen.getByRole("button", { name: "Back to all options" })).toBeDefined();

    act(() => {
      search.focus();
    });
    await user.keyboard("{Backspace}");

    expect(screen.getByRole("searchbox", { name: "Search options" })).toBeDefined();
    expect(screen.queryByRole("button", { name: /^Back to/u })).toBeNull();
  });

  it("opens the highlighted branch with the forward arrow at the end of the text", async () => {
    const user = userEvent.setup();

    render(<Fixture searchable />);
    await openMenu(user);
    await user.type(screen.getByRole("searchbox", { name: "Search options" }), "germ");
    await waitFor(() => {
      expect(Object.hasOwn(item("Germany").dataset, "highlighted")).toBeTruthy();
    });
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("searchbox", { name: "Search Germany" })).toBeDefined();
    expect(item("Berlin")).toBeDefined();
  });

  it("throws a named error for a search part outside a searchable root", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() =>
      render(
        <Cascader.Root items={tree} defaultOpen>
          <Cascader.Portal>
            <Cascader.Positioner>
              <Cascader.Popup>
                <Cascader.Search />
              </Cascader.Popup>
            </Cascader.Positioner>
          </Cascader.Portal>
        </Cascader.Root>,
      ),
    ).toThrow("Cascader.Search needs <Cascader.Root searchable>.");
  });
});

describe("Cascader multiple", () => {
  it("toggles leaves, counts them on branches, and submits each value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn<MultipleChange>();

    const { container } = render(
      <form>
        <Fixture multiple name="places" onValueChange={onValueChange} withClear />
      </form>,
    );

    await openMenu(user);
    await user.click(item("Europe"));
    await user.click(item("Germany"));
    await user.click(item("Berlin"));
    await user.click(item("Munich"));

    expect(onValueChange).toHaveBeenLastCalledWith(["berlin", "munich"], expect.anything());
    expect({
      menuOpen: screen.queryByRole("menu") !== null,
      submitted: [...container.querySelectorAll<HTMLInputElement>("input[name=places]")].map(
        (input) => input.value,
      ),
    }).toStrictEqual({ menuOpen: true, submitted: ["berlin", "munich"] });

    await user.click(screen.getByRole("menuitem", { name: "Back" }));
    expect(screen.getByTestId("count-germany").textContent).toBe("2, 2 selected");

    await user.click(screen.getByRole("button", { name: "Clear" }));
    const [cleared, clearDetails] = onValueChange.mock.lastCall ?? [];
    expect({
      clearDisabled: screen.getByRole("button", { name: "Clear" }).hasAttribute("disabled"),
      reason: clearDetails?.reason,
      value: cleared,
    }).toStrictEqual({ clearDisabled: true, reason: "clear-press", value: [] });
  });
});

describe("Cascader outside its root", () => {
  it("throws a named error", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Cascader.Value />)).toThrow(
      "Cascader.Value must be placed within <Cascader.Root>.",
    );
  });
});
