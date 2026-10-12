import { SurfaceStage, coloredSurfaces, tagColors } from "../helpers";

const Example = () => (
  <SurfaceStage>
    <div className="grid w-full max-w-lg gap-group">
      {coloredSurfaces.map(([color, fill, tint]) => (
        <div key={color} className="grid grid-cols-2 gap-group">
          <div className={`${fill} rounded-lg border p-3`}>{color} fill</div>
          <div className={`${tint} rounded-lg border p-3`}>{color} tint</div>
        </div>
      ))}
      <div className="flex flex-wrap gap-related">
        {tagColors.map(([color, classes]) => (
          <span
            key={color}
            className={`${classes} rounded-full border px-2.5 py-0.5 text-metadata font-medium`}
          >
            {color}
          </span>
        ))}
      </div>
    </div>
  </SurfaceStage>
);

export default Example;
