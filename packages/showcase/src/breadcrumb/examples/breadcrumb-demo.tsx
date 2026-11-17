import { Breadcrumb } from "@erbium/ui/components/breadcrumb";

export default function BreadcrumbExample() {
  return <Breadcrumb items={[{ href: "/", label: "Home" }]} currentPage="Components" />;
}
