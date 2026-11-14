import { useState } from "react";
import { Pagination, PaginationControls } from "@erbium/ui/components/pagination";

const pageCount = 10;

const PaginationDemo = () => {
  const [page, setPage] = useState(5);

  return (
    <div className="flex flex-col gap-group">
      <Pagination>
        <PaginationControls page={page} pageCount={pageCount} onPageChange={setPage} />
      </Pagination>
      <p className="text-center text-caption text-muted-foreground" aria-live="polite">
        Page {page} of {pageCount}
      </p>
    </div>
  );
};

export default PaginationDemo;
