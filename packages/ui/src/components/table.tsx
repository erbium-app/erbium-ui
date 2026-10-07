import * as React from "react";
import { cn } from "../lib/utils";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table
        data-slot="table"
        className={cn("w-full border-separate border-spacing-0 caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead data-slot="table-header" className={cn("[&_tr]:carve-bottom", className)} {...props} />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn(
        "[&_tr:last-child]:bg-none [&>tr[data-state=selected]>td]:carve-bottom [&>tr[data-state=selected]>td]:bg-(--surface-tint-selected) [&>tr:last-child[data-state=selected]>td]:bg-none [&>tr[data-state=selected]>td:first-child]:rounded-s-lg [&>tr[data-state=selected]>td:last-child]:rounded-e-lg [&>tr[data-state=selected]:has(+tr[data-state=selected])>td]:rounded-b-none [&>tr[data-state=selected]+tr[data-state=selected]>td]:rounded-t-none",
        className,
      )}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn("carve-top bg-footer font-medium [&>tr]:last:bg-none", className)}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "carve-bottom transition-colors hover:bg-muted-hover has-aria-expanded:bg-muted-hover",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-start align-middle font-medium whitespace-nowrap text-foreground has-[[role=checkbox]]:pe-0",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn("p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pe-0", className)}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };

/** TanStack Table's headless hook used with the shadcn Table primitives. */
export { useTable } from "@tanstack/react-table";
