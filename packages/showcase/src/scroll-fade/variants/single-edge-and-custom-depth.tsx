import { Fragment } from "react";
import { Separator } from "@erbium/ui/components/separator";

import { rows } from "../helpers";

export default function ScrollFadeSingleEdgeAndCustomDepthExample() {
  return (
    <div className="w-72 overflow-hidden rounded-lg border surface-panel">
      <div className="h-56 overflow-y-auto px-4 scroll-fade-b-8">
        {rows.map((row, index) => (
          <Fragment key={row}>
            {index > 0 ? <Separator /> : null}
            <div className="py-4 text-caption">Bottom edge only · row {row}</div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
