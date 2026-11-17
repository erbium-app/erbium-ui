import { Breadcrumb } from "@erbium/ui/components/breadcrumb";

export const BreadcrumbBasic = () => (
  <Breadcrumb
    items={[
      { href: "/", label: "Home" },
      { href: "/docs/components", label: "Components" },
    ]}
    currentPage="Breadcrumb"
  />
);
