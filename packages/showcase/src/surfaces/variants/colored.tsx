import { Canvas, coloredSurfaces, tagColors } from "../helpers";

const Example = () => (
  <Canvas>
    <div className="grid w-full max-w-lg gap-4">
      {coloredSurfaces.map(([color, fill, tint]) => (
        <div key={color} className="grid grid-cols-2 gap-4">
          <div className={`${fill} rounded-lg border p-3`}>{color} fill</div>
          <div className={`${tint} rounded-lg border p-3`}>{color} tint</div>
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        {tagColors.map(([color, classes]) => (
          <span
            key={color}
            className={`${classes} rounded-full border px-2.5 py-0.5 text-xs font-medium`}
          >
            {color}
          </span>
        ))}
      </div>
    </div>
  </Canvas>
);

export default Example;
