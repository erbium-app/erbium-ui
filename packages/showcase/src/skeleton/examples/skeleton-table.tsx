import { DataTable } from "@erbium/ui/blocks/data-table";
import { Badge } from "@erbium/ui/components/badge";
import { createColumnHelper, tableFeatures, useTable } from "@tanstack/react-table";
import { LoadingControls, useSimulatedFetch } from "../../loading";
import { members, sampleMembers } from "../fixtures";
import type { Member } from "../fixtures";

const features = tableFeatures({});
const columnHelper = createColumnHelper<typeof features, Member>();

const columns = columnHelper.columns([
  columnHelper.accessor("name", {
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    header: "Name",
  }),
  columnHelper.accessor("email", { header: "Email" }),
  columnHelper.accessor("role", {
    cell: (info) => <Badge variant="outline">{info.getValue()}</Badge>,
    header: "Role",
  }),
]);

/**
 * The table is built from sample rows until the first response, so its skeleton has real rows. The
 * header is known, so it stays readable throughout, and set column widths keep the sample rows
 * from sizing the columns differently from the members that replace them.
 */
export const SkeletonTable = ({ latency }: { latency?: number }) => {
  const request = useSimulatedFetch(members, { latency });
  const table = useTable({ columns, data: request.data ?? sampleMembers, features });

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-group">
      <DataTable
        table={table}
        loading={request.loading}
        id="skeleton-members-table"
        columnWidths={{ name: "35%", role: "7rem" }}
        label="Loading members"
      />
      <LoadingControls {...request} />
    </div>
  );
};
