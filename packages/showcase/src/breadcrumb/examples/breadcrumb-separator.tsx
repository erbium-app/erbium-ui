import { Icon } from "@erbium/ui/components/icon";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@erbium/ui/components/breadcrumb";

export const BreadcrumbSeparatorDemo = () => (
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink render={<a href="/" />}>Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator>
        <Icon name="dot" />
      </BreadcrumbSeparator>
      <BreadcrumbItem>
        <BreadcrumbLink render={<a href="/docs/installation" />}>Installation</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator>
        <Icon name="dot" />
      </BreadcrumbSeparator>
      <BreadcrumbItem>
        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
);
