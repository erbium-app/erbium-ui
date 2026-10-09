export const tableStyles = {
  table: "w-full border-separate border-spacing-0 caption-bottom text-caption",
  tableHeader: "[&_tr]:carve-bottom",
  tableBody:
    "[&_tr:last-child]:bg-none [&>tr[data-state=selected]>td]:carve-bottom [&>tr[data-state=selected]>td]:bg-(--surface-tint-selected) [&>tr:last-child[data-state=selected]>td]:bg-none [&>tr[data-state=selected]>td:first-child]:rounded-s-lg [&>tr[data-state=selected]>td:last-child]:rounded-e-lg [&>tr[data-state=selected]:has(+tr[data-state=selected])>td]:rounded-b-none [&>tr[data-state=selected]+tr[data-state=selected]>td]:rounded-t-none",
  tableFooter: "carve-top bg-footer font-medium [&>tr]:last:bg-none",
  tableRow: "carve-bottom transition-colors hover:bg-muted-hover has-aria-expanded:bg-muted-hover",
  tableHead:
    "h-row px-related text-start align-middle font-medium whitespace-nowrap text-foreground has-[[role=checkbox]]:pe-0",
  tableCell: "px-related py-control-gap align-middle whitespace-nowrap has-[[role=checkbox]]:pe-0",
  tableCaption: "mt-4 text-caption text-muted-foreground",
} as const;
