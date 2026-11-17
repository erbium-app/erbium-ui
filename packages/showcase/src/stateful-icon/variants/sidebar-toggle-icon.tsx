import { SidebarToggleIconExample } from "../helpers";

export default function StatefulIconSidebarToggleIconExample() {
  return (
    <div className="flex gap-3">
      <SidebarToggleIconExample side="left" />
      <SidebarToggleIconExample side="right" />
    </div>
  );
}
