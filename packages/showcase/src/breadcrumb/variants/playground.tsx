import { Breadcrumb } from "@erbium/ui/components/breadcrumb";

export const defaultProps = {
  currentPage: "Current page",
  separator: "/",
} satisfies { separator: string; currentPage: string };

export default function BreadcrumbPlaygroundExample(
  args: { separator: string; currentPage: string } = defaultProps,
) {
  return (
    <Breadcrumb
      items={[{ href: "/", label: "Home" }]}
      currentPage={args.currentPage}
      separator={args.separator}
    />
  );
}
