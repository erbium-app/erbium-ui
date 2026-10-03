import { Canvas, control, sunk, stateRoles, states } from "../helpers";

const Example = () => (
  <Canvas>
    <div className="grid gap-4 rounded-xl border surface-panel p-6">
      {stateRoles.map(([role, raised]) => (
        <div key={role} className="flex flex-wrap gap-4">
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
  </Canvas>
);

export default Example;
