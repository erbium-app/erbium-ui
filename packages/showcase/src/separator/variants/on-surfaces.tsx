import { Separator } from "@erbium/ui/components/separator";
import { surfaceSamples } from "../helpers";

const Example = () => (
  <div className="grid w-160 max-w-[calc(100vw-2rem)] grid-cols-2 gap-3 p-4 sm:grid-cols-3">
    {surfaceSamples.map(([name, surface]) => (
      <div
        key={name}
        className={`flex min-h-24 flex-col justify-center gap-related rounded-lg border border-transparent p-3 ${surface}`}
      >
        <span className="text-metadata font-medium">{name}</span>
        <Separator />
        <Separator className="text-metadata">or</Separator>
      </div>
    ))}
  </div>
);

export default Example;
