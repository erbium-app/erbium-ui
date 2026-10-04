import { HugeiconsIcon } from "@hugeicons/react";
import DotIcon from "@hugeicons/core-free-icons/DotIcon";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@erbium/ui/components/breadcrumb";

export function BreadcrumbSeparatorDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<a href="/" />}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <HugeiconsIcon icon={DotIcon} />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink render={<a href="/docs/installation" />}>Installation</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <HugeiconsIcon icon={DotIcon} />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
