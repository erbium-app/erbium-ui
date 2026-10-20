import { Slider } from "@erbium/ui/components/slider";

export const SliderVertical = () => (
  <div className="mx-auto flex w-full max-w-xs items-center justify-center gap-section">
    <Slider defaultValue={[50]} max={100} step={1} orientation="vertical" className="h-40" />
    <Slider defaultValue={[25]} max={100} step={1} orientation="vertical" className="h-40" />
  </div>
);
