import { Slider } from "@erbium/ui/components/slider";

export default function SliderDisabledExample() {
  return (
    <Slider disabled defaultValue={[50]} max={100} className="w-64" aria-label="Unavailable" />
  );
}
