import { useState } from "react";
import type { MouseEvent } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@erbium/ui/components/pagination";

export default function PaginationDemo() {
  const [page, setPage] = useState(2);
  function navigate(nextPage: number) {
    return (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setPage(Math.min(3, Math.max(1, nextPage)));
    };
  }
  return (
    <div className="flex flex-col gap-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`?page=${page - 1}`}
              aria-disabled={page === 1}
              onClick={navigate(page - 1)}
            />
          </PaginationItem>
          {[1, 2, 3].map((number) => (
            <PaginationItem key={number}>
              <PaginationLink
                href={`?page=${number}`}
                isActive={page === number}
                onClick={navigate(number)}
              >
                {number}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href={`?page=${page + 1}`}
              aria-disabled={page === 3}
              onClick={navigate(page + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <p className="text-center text-sm text-muted-foreground" aria-live="polite">
        Page {page} of 3
      </p>
    </div>
  );
}
