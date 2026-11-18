import { act, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vite-plus/test";
import {
  createRule,
  Filters,
  getFilterEditor,
  getFilterOperatorChoices,
  getFilterSummary,
  useFilterEditorState,
} from "./index";
import type { FilterField, FilterRule } from "./index";

const fieldFor = (rule: FilterRule): FilterField => ({
  id: "example",
  label: "Example",
  options: [],
  rule,
  setRule: vi.fn<FilterField["setRule"]>(),
  type: rule.type,
});

describe("filter summaries", () => {
  it("resolves nested choices and keeps their order when showing a count", () => {
    const field = {
      ...fieldFor({ ...createRule("option"), values: ["paid", null, "legacy", "open"] }),
      options: [
        {
          children: [
            { label: "Paid", value: "paid" },
            { label: "Open", value: "open" },
          ],
          label: "Status",
          value: "status",
        },
      ],
    };

    const options = { maxOptionLabels: 2 };

    expect(getFilterSummary(field, options)).toEqual({
      collapsed: true,
      options: [
        { label: "Paid", value: "paid" },
        { label: "legacy", value: "legacy" },
        { label: "Open", value: "open" },
      ],
      text: "3 selected",
    });

    render(
      <Filters.Field field={field}>
        <Filters.Summary options={options} data-testid="summary" />
      </Filters.Field>,
    );

    expect(screen.getByTestId("summary").textContent).toBe("3 selected");
    expect(Object.hasOwn(screen.getByTestId("summary").dataset, "collapsed")).toBe(true);
  });

  it("formats numbers and dates while keeping open range endpoints", () => {
    const number = fieldFor({ ...createRule("number"), operator: "between", values: [null, 1250] });
    expect(getFilterSummary(number, { locale: "en-US" }).text).toBe("… – 1,250");

    const date = fieldFor({ ...createRule("date"), values: ["2026-11-18"] });
    expect(getFilterSummary(date, { locale: "en-US" }).text).toBe("Nov 18, 2026");
  });

  it("exposes empty rules for placeholder styling", () => {
    render(
      <Filters.Field field={fieldFor(createRule("text"))}>
        <Filters.Summary placeholder="Choose…" data-testid="summary" />
      </Filters.Field>,
    );

    expect(screen.getByTestId("summary").textContent).toBe("Choose…");
    expect(Object.hasOwn(screen.getByTestId("summary").dataset, "empty")).toBe(true);
  });
});

describe("filter editor bindings", () => {
  it("binds each numeric range endpoint and formats its bound placeholder", () => {
    const field: FilterField = {
      ...fieldFor({ ...createRule("number"), operator: "between", values: [10, null] }),
      min: 2,
      range: [1, 1000],
    };

    const editor = getFilterEditor(field, { locale: "en-US" });

    expect(editor).toMatchObject({
      end: { label: "Example to", placeholder: "1,000", value: null },
      start: { label: "Example from", placeholder: "2", value: 10 },
      type: "number",
    });

    if (editor.type !== "number" || editor.end === undefined) {
      throw new Error("Expected a numeric range");
    }

    editor.end.onValueChange(20);
    expect(field.setRule).toHaveBeenLastCalledWith({
      operator: "between",
      type: "number",
      values: [10, 20],
    });
  });

  it("adapts calendar selections and removes empty rules on close", () => {
    const field = fieldFor({ ...createRule("date"), operator: "between" });
    const onOpenChange = vi.fn<(open: boolean) => void>();
    const editor = getFilterEditor(field, { onOpenChange });

    if (editor.type !== "date" || editor.calendar.mode !== "range") {
      throw new Error("Expected a date range");
    }

    editor.calendar.onSelect({ from: new Date(2026, 10, 18) });
    expect(field.setRule).toHaveBeenLastCalledWith({
      operator: "between",
      type: "date",
      values: ["2026-11-18", null],
    });
    editor.onOpenChange(false);
    expect(field.setRule).toHaveBeenLastCalledWith(undefined);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("labels option operators from the current selection", () => {
    const field = fieldFor({ ...createRule("option"), values: ["paid", "open"] });
    const choices = getFilterOperatorChoices(field);

    expect(choices?.items).toContainEqual({
      label: choices?.label,
      operator: field.rule?.operator,
    });
  });

  it("keeps the current editor open when an earlier editor finishes closing", () => {
    const { result } = renderHook(useFilterEditorState);
    const first = { id: "first", type: "text" as const };
    const second = { id: "second", type: "number" as const };

    act(() => {
      result.current.onFieldAdded(first.id);
    });
    expect(result.current.getEditorProps(first).open).toBe(true);

    act(() => {
      result.current.onFieldAdded(second.id);
      result.current.getEditorProps(first).onOpenChange?.(false);
    });
    expect(result.current.getEditorProps(second).open).toBe(true);
  });
});
