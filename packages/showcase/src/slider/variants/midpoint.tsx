import { Slider } from "@erbium/ui/components/slider";

export default function SliderMidpointExample() {
  return <Slider defaultValue={[50]} max={100} className="w-64" aria-label="Volume" />;
}
