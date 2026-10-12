import { SurfaceStage, control, sunk, stateRoles, states } from "../helpers";

const Example = () => (
  <SurfaceStage>
    <div className="grid w-full max-w-3xl gap-group rounded-xl border surface-panel p-6">
      {stateRoles.map(([role, raised]) => (
        <div key={role} className="flex flex-wrap gap-group">
          {states.map(([name, attributes, classes]) => (
            <span
              key={name}
              {...attributes}
              className={`${control} border ${role} ${classes} ${name === "pressed" && raised ? sunk : ""}`}
            >
              {name}
            </span>
          ))}
        </div>
      ))}
    </div>
  </SurfaceStage>
);

export default Example;
