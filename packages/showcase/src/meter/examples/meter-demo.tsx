import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from "@erbium/ui/components/meter";

const MeterDemo = () => (
  <Meter value={24} className="w-72">
    <MeterLabel>Storage used</MeterLabel>
    <MeterValue />
    <MeterTrack>
      <MeterIndicator />
    </MeterTrack>
  </Meter>
);

export default MeterDemo;
