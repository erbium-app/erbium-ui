import { Breadcrumb } from "@erbium/ui/components/breadcrumb";

export default function BreadcrumbBasicExample() {
  return (
    <Breadcrumb
      items={[
        { href: "/", label: "Home" },
        { href: "/docs/components", label: "Components" },
      ]}
      currentPage="Breadcrumb"
    />
  );
}
