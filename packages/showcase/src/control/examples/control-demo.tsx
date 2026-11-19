import { useState } from "react";
import { Control } from "@erbium/ui/components/control";

const orientations = [
  { label: "Portrait", value: "portrait" },
  { label: "Square", value: "square" },
  { label: "Landscape", value: "landscape" },
];

export default function ControlExample() {
  const [title, setTitle] = useState("Japan");
  const [opacity, setOpacity] = useState(0.6);
  const [scale, setScale] = useState(1.03);
  const [visible, setVisible] = useState(true);
  const [orientation, setOrientation] = useState("portrait");

  return (
    <div className="w-72 rounded-xl border surface-panel p-3">
      <h3 className="mb-3 text-subtitle">Photo Stack</h3>
      <Control.Group>
        <Control.Text label="Title" value={title} onValueChange={setTitle} />
        <Control.Select
          label="Photo Shape"
          options={orientations}
          value={orientation}
          onValueChange={setOrientation}
        />
        <Control.Toggle label="Visible" checked={visible} onCheckedChange={setVisible} />
        <Control.Section title="Back Photo">
          <Control.Number label="Frames" steps={[1, 2, 3, 4]} defaultValue={3} marks />
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
            step={0.01}
            formatValue={(value) => value.toFixed(2)}
            onValueChange={setOpacity}
          />
        </Control.Section>
      </Control.Group>
    </div>
  );
}
