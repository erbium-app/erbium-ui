import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from "@erbium/ui/components/meter";

const Example = () => (
  <Meter value={72} min={0} max={100} format={{ style: "unit", unit: "percent" }} className="w-72">
    <MeterLabel>Battery</MeterLabel>
    <MeterValue />
    <MeterTrack>
      <MeterIndicator />
    </MeterTrack>
  </Meter>
);

export default Example;
