// @ts-nocheck
import { Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue } from "../components/meter";

export default function MeterDemo() {
  return (
    <Meter value={24} className="w-72">
      <MeterLabel>Storage used</MeterLabel>
      <MeterValue />
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>
  );
}
