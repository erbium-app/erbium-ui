import { DirectionProvider } from "@erbium/ui/components/direction";

const Example = (args: { direction: "ltr" | "rtl" }) => (
  <DirectionProvider direction={args.direction}>
    <div dir={args.direction} className="w-72 rounded border p-4">
      Direction: {args.direction}
      <div className="mt-2 flex gap-related">
        <button className="rounded border p-2">First</button>
        <button className="rounded border p-2">Second</button>
      </div>
    </div>
  </DirectionProvider>
);

export default Example;
