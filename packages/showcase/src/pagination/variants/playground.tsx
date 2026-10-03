import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@erbium/ui/components/pagination";
import { Pagination } from "@erbium/ui/components/pagination";
import type * as React from "react";

const Example = (args: React.ComponentProps<typeof Pagination>) => (
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

export default Example;
