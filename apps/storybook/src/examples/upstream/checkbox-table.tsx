import { Checkbox } from "@erbium/ui/components/checkbox";
import { useDragSelect } from "@erbium/ui/hooks/use-drag-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erbium/ui/components/table";
import {
  createColumnHelper,
  metaHelper,
  rowSelectionFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const tableData: User[] = [
  { id: "1", name: "Sarah Chen", email: "sarah.chen@example.com", role: "Admin" },
  { id: "2", name: "Marcus Rodriguez", email: "marcus.rodriguez@example.com", role: "User" },
  { id: "3", name: "Priya Patel", email: "priya.patel@example.com", role: "User" },
  { id: "4", name: "David Kim", email: "david.kim@example.com", role: "Editor" },
];

const features = tableFeatures({
  rowSelectionFeature,
  columnMeta: metaHelper<{ className?: string }>(),
});

const columnHelper = createColumnHelper<typeof features, User>();

const columns = columnHelper.columns([
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all rows"
        checked={table.getIsAllRowsSelected()}
        // v9's getIsSomeRowsSelected() is also true when every row is selected.
        indeterminate={table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllRowsSelected(checked)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Select ${row.original.name}`}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
      />
    ),
    meta: { className: "w-8" },
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor("email", { header: "Email" }),
  columnHelper.accessor("role", { header: "Role" }),
]);

export function CheckboxInTable() {
  const table = useTable({
    features,
    columns,
    data: tableData,
    getRowId: (row) => row.id,
    initialState: { rowSelection: { "1": true } },
  });
  const rows = table.getRowModel().rows;
  const dragSelect = useDragSelect({
    resolve(target) {
      const index = target.closest("tr")?.sectionRowIndex ?? -1;
      const row = rows[index];
      return row?.getCanSelect() ? { index, selected: row.getIsSelected() } : null;
    },
    selectRange(start, end, selected) {
      for (const row of rows.slice(start, end + 1)) {
        if (row.getCanSelect()) {
          row.toggleSelected(selected);
        }
      }
    },
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead className={header.column.columnDef.meta?.className} key={header.id}>
                {header.isPlaceholder ? null : <table.FlexRender header={header} />}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody {...dragSelect}>
        {rows.map((row) => (
          <TableRow data-state={row.getIsSelected() ? "selected" : undefined} key={row.id}>
            {row.getAllCells().map((cell) => (
              <TableCell className={cell.column.columnDef.meta?.className} key={cell.id}>
                <table.FlexRender cell={cell} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
