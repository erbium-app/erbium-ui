import { Canvas, ladder } from "../helpers";

const Example = () => (
  <Canvas>
    <div className="flex flex-wrap gap-8">
      {ladder.map(([name, classes, use]) => (
        <div key={name} className="grid justify-items-center gap-3">
          <div className={`size-24 rounded-xl ${classes}`} />
          <div className="text-center">
            <div className="font-medium">{name}</div>
            <div className="text-xs text-muted-foreground">{use}</div>
          </div>
        </div>
      ))}
    </div>
  </Canvas>
);

export default Example;
