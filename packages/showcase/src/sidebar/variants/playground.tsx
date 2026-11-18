import SidebarExample from "../examples/sidebar-demo";
import type { SidebarExampleProps } from "../examples/sidebar-demo";

export const defaultProps = {
  collapsible: "icon",
  defaultOpen: true,
  side: "left",
  variant: "sidebar",
} satisfies Required<SidebarExampleProps>;

export default function SidebarPlaygroundExample(
  args: Required<SidebarExampleProps> = defaultProps,
) {
  return <SidebarExample {...args} />;
}
