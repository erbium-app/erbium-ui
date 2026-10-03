import { rows } from "../helpers";

const Example = () => (
  <div dir="rtl" className="scroll-fade-x flex w-96 gap-3 overflow-x-auto p-4">
    {rows.map((row) => (
      <div
        key={row}
        className="grid h-36 min-w-32 shrink-0 place-items-center rounded-lg border bg-card text-sm"
      >
        Card {row}
      </div>
    ))}
  </div>
);

export default Example;
