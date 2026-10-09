import { Separator } from "@erbium/ui/components/separator";

const Example = () => (
  <div className="grid w-72 gap-6">
    <div className="overflow-hidden rounded-lg surface-panel py-3">
      <div className="px-3 pb-3 text-caption">Card header</div>
      <Separator />
      <div className="separator-inset grid gap-3 p-3 text-caption text-muted-foreground">
        Card content
        <Separator />
        Inset content divider
      </div>
    </div>
    <div className="grid gap-3 text-caption text-muted-foreground">
      Canvas
      <Separator />
      <Separator variant="full" />
    </div>
  </div>
);

export default Example;
