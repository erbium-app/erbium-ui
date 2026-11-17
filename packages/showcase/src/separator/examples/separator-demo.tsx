import { Separator } from "@erbium/ui/components/separator";

export default function SeparatorExample() {
  return (
    <div>
      <div className="space-y-1">
        <h4 className="text-subtitle">Radix Primitives</h4>
        <p className="text-caption text-muted-foreground">An open-source UI component library.</p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-caption">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  );
}
