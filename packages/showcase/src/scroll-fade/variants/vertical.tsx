import { rows } from "../helpers";

const Example = () => (
  <div className="w-72 overflow-hidden rounded-lg border surface-panel">
    <div className="scroll-fade h-56 overflow-y-auto px-4">
      {rows.map((row) => (
        <div key={row} className="border-b py-4 text-caption">
          Scrollable row {row}
        </div>
      ))}
    </div>
  </div>
);

export default Example;
