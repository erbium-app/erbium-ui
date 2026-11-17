import { Breadcrumb } from "@erbium/ui/components/breadcrumb";
import { Icon } from "@erbium/ui/components/icon";

export const BreadcrumbSeparatorDemo = () => (
  <Breadcrumb
    items={[
      { href: "/", label: "Home" },
      { href: "/docs/installation", label: "Installation" },
    ]}
    currentPage="Breadcrumb"
    separator={<Icon name="dot" />}
  />
);
