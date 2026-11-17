import { Breadcrumb } from "@erbium/ui/components/breadcrumb";

const Example = (args: { separator: string; currentPage: string }) => (
  <Breadcrumb
    items={[{ href: "/", label: "Home" }]}
    currentPage={args.currentPage}
    separator={args.separator}
  />
);

export default Example;
