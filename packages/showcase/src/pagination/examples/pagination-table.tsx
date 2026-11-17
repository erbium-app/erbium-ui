import { useRef, useState } from "react";
import {
  createColumnHelper,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import { Field, FieldLabel } from "@erbium/ui/components/field";
import { Pagination, PaginationControls } from "@erbium/ui/components/pagination";
import { Switch } from "@erbium/ui/components/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erbium/ui/components/table";

// The server takes this long to answer each page request.
const loadTime = 700;
const pageSize = 4;
const rowCount = 42;

interface Invoice {
  invoice: string;
  amount: number;
}

const wait = async (ms: number) => {
  // Browsers have no promise-based timer, so the delay wraps `setTimeout`.
  // oxlint-disable-next-line promise/avoid-new
  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const rowsOf = (page: number): Invoice[] =>
  Array.from({ length: pageSize }, (_, index) => (page - 1) * pageSize + index + 1)
    .filter((row) => row <= rowCount)
    .map((row) => ({
      amount: ((row * 37) % 900) + 100,
      invoice: `INV${String(row).padStart(3, "0")}`,
    }));

// Stands in for an API that returns one page of rows.
const fetchInvoices = async (page: number) => {
  await wait(loadTime);

  return rowsOf(page);
};

const currency = new Intl.NumberFormat("en-US", { currency: "USD", style: "currency" });

const features = tableFeatures({ rowPaginationFeature });

const columnHelper = createColumnHelper<typeof features, Invoice>();

const columns = columnHelper.columns([
  columnHelper.accessor("invoice", { header: "Invoice" }),
  columnHelper.accessor("amount", {
    cell: (info) => currency.format(info.getValue()),
    header: "Amount",
  }),
]);

interface Loaded {
  page: number;
  rows: Invoice[];
  // Milliseconds from the click to the rows, or -1 for the first page.
  waited: number;
}

const statusOf = (page: number, loaded: Loaded) => {
  if (loaded.page !== page) {
    return `Loading page ${page}…`;
  }

  if (loaded.waited < 0) {
    return `Each page takes ${loadTime} ms to load.`;
  }

  if (loaded.waited > 50) {
    return `Page ${page} loaded ${loaded.waited} ms after the click.`;
  }

  return `Page ${page} was fetched before the click.`;
};

export default function PaginationTableExample() {
  const [predict, setPredict] = useState(true);
  const [page, setPage] = useState(1);
  // The first page arrives with the document, as a route loader would provide it.
  const [loaded, setLoaded] = useState<Loaded>({ page: 1, rows: rowsOf(1), waited: -1 });
  const latestPage = useRef(1);

  // A cache of page requests, as TanStack Query or an atom family would keep. A request
  // started by `onPageIntent` is reused by the click.
  const requests = useRef(new Map<number, Promise<Invoice[]>>());

  const request = async (target: number) => {
    const cached = requests.current.get(target);

    if (cached !== undefined) {
      return await cached;
    }

    const pending = fetchInvoices(target);
    requests.current.set(target, pending);

    return await pending;
  };

  const goTo = async (target: number) => {
    const clickedAt = performance.now();
    latestPage.current = target;
    setPage(target);
    const rows = await request(target);

    // A later click wins over a slower earlier one.
    if (latestPage.current === target) {
      setLoaded({ page: target, rows, waited: Math.round(performance.now() - clickedAt) });
    }
  };

  const table = useTable({
    columns,
    data: loaded.rows,
    features,
    manualPagination: true,
    rowCount,
    state: { pagination: { pageIndex: page - 1, pageSize } },
  });

  const isLoading = loaded.page !== page;

  return (
    <div className="flex w-full max-w-md flex-col gap-group">
      <Table aria-busy={isLoading} className={isLoading ? "opacity-50" : undefined}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  <table.FlexRender header={header} />
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id} className="tabular-nums">
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationControls
          page={page}
          pageCount={table.getPageCount()}
          onPageChange={(target) => {
            void goTo(target);
          }}
          onPageIntent={
            predict
              ? (target) => {
                  void request(target);
                }
              : undefined
          }
        />
      </Pagination>
      <p className="text-center text-caption text-muted-foreground" aria-live="polite">
        {statusOf(page, loaded)}
      </p>
      <Field orientation="horizontal" className="justify-center">
        <Switch checked={predict} onCheckedChange={setPredict} />
        <FieldLabel>Prefetch on intent</FieldLabel>
      </Field>
    </div>
  );
}
