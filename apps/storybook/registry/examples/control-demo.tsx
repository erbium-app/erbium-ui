// @ts-nocheck
import { useState } from "react";
import { Control } from "../components/control";

const shapes = [
  { label: "Portrait", value: "portrait" },
  { label: "Square", value: "square" },
  { label: "Landscape", value: "landscape" },
];

export default function ControlDemo() {
  const [title, setTitle] = useState("Japan");
  const [opacity, setOpacity] = useState(0.6);
  const [scale, setScale] = useState(1.03);
  const [visible, setVisible] = useState(true);
  const [shape, setShape] = useState("portrait");
  const [color, setColor] = useState("#393a34");

  return (
    <div className="w-72 rounded-xl border surface-panel p-3">
      <h3 className="mb-3 text-sm font-semibold">Photo Stack</h3>
      <Control.Group>
        <Control.Text label="Title" value={title} onValueChange={setTitle} />
        <Control.Select
          label="Photo Shape"
          options={shapes}
          value={shape}
          onValueChange={setShape}
        />
        <Control.Color label="Shadow Tint" value={color} onValueChange={setColor} />
        <Control.Boolean label="Visible" checked={visible} onCheckedChange={setVisible} />
        <Control.Section title="Back Photo">
          <Control.Number label="Frames" steps={[1, 2, 3, 4]} defaultValue={3} />
          <Control.Number
            label="Scale"
            value={scale}
            min={0.5}
            max={2}
            step={0.01}
            onValueChange={setScale}
          />
          <Control.Number
            label="Overlay Opacity"
            value={opacity}
            min={0}
            max={1}
            mode="continuous"
            formatValue={(value) => value.toFixed(2)}
            onValueChange={setOpacity}
          />
        </Control.Section>
      </Control.Group>
    </div>
  );
}
