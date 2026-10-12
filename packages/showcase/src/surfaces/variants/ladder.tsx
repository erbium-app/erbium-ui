import { SurfaceStage, ladder } from "../helpers";

const Example = () => (
  <SurfaceStage>
    <div className="flex w-full max-w-2xl flex-wrap justify-center gap-x-4 gap-y-8">
      {ladder.map(([name, classes, use]) => (
        <div key={name} className="grid w-32 content-start justify-items-center gap-3">
          <div className={`size-24 rounded-xl ${classes}`} />
          <div className="text-center">
            <div className="font-medium">{name}</div>
            <div className="text-metadata text-muted-foreground">{use}</div>
          </div>
        </div>
      ))}
    </div>
  </SurfaceStage>
);

export default Example;
