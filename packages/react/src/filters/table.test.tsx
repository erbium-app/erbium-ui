import {
  columnFacetingFeature,
  columnFilteringFeature,
  createColumnHelper,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";
import { createRule, filterColumn, useOptionPicker, useTableFilters } from "./index";

const data = [
  { status: "open", estimate: 2 },
  { status: "open", estimate: 8 },
  { status: "paid", estimate: 5 },
];

const features = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  facetedMinMaxValues: createFacetedMinMaxValues(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
});

const helper = createColumnHelper<typeof features, (typeof data)[number]>();

const columns = helper.columns([
  helper.accessor("status", {
    ...filterColumn({
      label: "Status",
      options: [
        {
          children: [
            { label: "Open", value: "open" },
            { disabled: true, keywords: ["settled"], label: "Paid", value: "paid" },
          ],
          label: "Workflow",
          value: "workflow",
        },
      ],
      type: "option",
    }),
  }),
  helper.accessor("estimate", { ...filterColumn({ label: "Estimate", type: "number" }) }),
]);

describe("Filters with TanStack Table v9", () => {
  it("updates picker nodes, facets and rows when column filters change outside the table selector", () => {
    const { result } = renderHook(() => {
      const table = useTable({ columns, data, features }, () => ({}));
      const filters = useTableFilters(table);
      const [status, estimate] = filters.fields;

      if (status === undefined || estimate === undefined) {
        throw new Error("Expected status and estimate filter fields");
      }

      const picker = useOptionPicker(status);

      return { estimate, filters, picker, status, table };
    });

    expect(result.current.picker.items[0]?.children).toMatchObject([
      { data: { count: 2 }, value: "open" },
      { data: { count: 1 }, disabled: true, keywords: ["settled"], value: "paid" },
    ]);

    act(() => {
      result.current.table.getColumn("estimate")?.setFilterValue({
        ...createRule("number"),
        operator: "lessThanOrEqual",
        values: [5],
      });
    });

    expect(result.current.filters.active.map(({ id }) => id)).toEqual(["estimate"]);
    expect(result.current.picker.items[0]?.children?.[0]?.data.count).toBe(1);

    act(() => {
      result.current.picker.onValueChange(["open"]);
    });

    expect(result.current.status.rule?.values).toEqual(["open"]);
    expect(result.current.estimate.range).toEqual([2, 8]);
    expect(result.current.table.getRowModel().rows.map(({ original }) => original)).toEqual([
      data[0],
    ]);
  });
});
