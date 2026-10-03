import { Marker } from "@erbium/ui/components/marker";

const Example = (args: {
  variant: "default" | "separator" | "border";
  asSpan: boolean;
  className: string;
}) => (
  <div className="w-72 max-w-[calc(100vw-2rem)]">
    <Marker
      variant={args.variant}
      render={args.asSpan ? <span /> : undefined}
      className={args.className}
    >
      Marker
    </Marker>
  </div>
);

export default Example;
