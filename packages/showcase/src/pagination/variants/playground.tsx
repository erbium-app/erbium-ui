import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  Pagination,
} from "@erbium/ui/components/pagination";
import type * as React from "react";

export const defaultProps = { className: "" } satisfies React.ComponentProps<typeof Pagination>;

export default function PaginationPlaygroundExample(
  args: React.ComponentProps<typeof Pagination> = defaultProps,
) {
  return (
    <Pagination {...args}>
      <PaginationContent>
        {[1, 2, 3].map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href="#" isActive={page === 2}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>
    </Pagination>
  );
}
