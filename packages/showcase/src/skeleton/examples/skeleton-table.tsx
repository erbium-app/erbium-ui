import { DataTable, DataTableContent } from "@erbium/ui/blocks/data-table";
import { Badge } from "@erbium/ui/components/badge";
import { createDataTableColumnHelper, useDataTable } from "@erbium/ui/hooks/use-data-table";
import { useSimulatedFetch } from "../../loading";
import { members, sampleMembers } from "../fixtures";
import type { Member } from "../fixtures";

const columnHelper = createDataTableColumnHelper<Member>();

const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    header: "Name",
  }),
  columnHelper.accessor("email", { header: "Email" }),
  columnHelper.accessor("role", {
    cell: (info) => <Badge variant="outline">{info.getValue()}</Badge>,
    header: "Role",
    size: 112,
  }),
]);

/**
 * The table is built from sample rows until the first response, so its skeleton has real rows. The
 * header is known, so it stays readable throughout, and a column with a set size makes the table
 * lay out at fixed widths, so the sample rows cannot size the columns differently from the members
 * that replace them.
 */
export const defaultProps = {} satisfies { latency?: number };

export default function SkeletonTableExample({ latency }: { latency?: number } = defaultProps) {
  const request = useSimulatedFetch(members, { latency });
  const table = useDataTable({ columns, data: request.data ?? sampleMembers });

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-group">
      <DataTable table={table} className="w-full">
        <DataTableContent
          loading={request.loading}
          id="skeleton-members-table"
          label="Loading members"
        />
      </DataTable>
    </div>
  );
}
