import { Marker } from "@erbium/ui/components/marker";

export const defaultProps = { asSpan: false, className: "", variant: "default" } satisfies {
  variant: "default" | "separator" | "border";
  asSpan: boolean;
  className: string;
};

export default function MarkerPlaygroundExample(
  args: {
    variant: "default" | "separator" | "border";
    asSpan: boolean;
    className: string;
  } = defaultProps,
) {
  return (
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
}
