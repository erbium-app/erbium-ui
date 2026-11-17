import { rows } from "../helpers";

export default function ScrollFadeHorizontalRtlExample() {
  return (
    <div dir="rtl" className="scroll-fade-x flex w-96 gap-3 overflow-x-auto p-4">
      {rows.map((row) => (
        <div
          key={row}
          className="grid h-36 min-w-32 shrink-0 place-items-center rounded-lg border bg-card text-caption"
        >
          Card {row}
        </div>
      ))}
    </div>
  );
}
