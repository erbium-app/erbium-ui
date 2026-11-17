import { DirectionProvider } from "@erbium/ui/components/direction";

export const defaultProps = { direction: "ltr" } satisfies { direction: "ltr" | "rtl" };

export default function DirectionPlaygroundExample(
  args: { direction: "ltr" | "rtl" } = defaultProps,
) {
  return (
    <DirectionProvider direction={args.direction}>
      <div dir={args.direction} className="w-72 rounded border p-4">
        Direction: {args.direction}
        <div className="mt-2 flex gap-related">
          <button type="button" className="rounded border p-2">
            First
          </button>
          <button type="button" className="rounded border p-2">
            Second
          </button>
        </div>
      </div>
    </DirectionProvider>
  );
}
