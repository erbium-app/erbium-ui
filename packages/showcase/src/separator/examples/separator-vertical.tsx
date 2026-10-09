import { Separator } from "@erbium/ui/components/separator";

export function SeparatorVertical() {
  return (
    <div className="flex h-5 items-center gap-group text-caption">
      <div>Blog</div>
      <Separator orientation="vertical" />
      <div>Docs</div>
      <Separator orientation="vertical" />
      <div>Source</div>
    </div>
  );
}
