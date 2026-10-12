import { Icon } from "@erbium/ui/components/icon";
import { Canvas, control } from "../helpers";

const Example = () => (
  <Canvas>
    <div className="grid w-full max-w-3xl items-start gap-8 @xl:grid-cols-2">
      <div className="grid gap-related">
        <span aria-expanded className={`${control} w-fit border surface-control`}>
          Workspace <Icon name="chevron-down" className="size-3.5" />
        </span>
        <div className="w-full max-w-56 rounded-xl border surface-overlay p-1">
          {["Profile", "Settings", "Sign out"].map((item, index) => (
            <div key={item} className={`rounded-md px-2 py-1.5 ${index === 1 ? "bg-accent" : ""}`}>
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-group rounded-2xl border surface-modal p-6">
        <div>
          <div className="text-body font-medium">Invite people</div>
          <div className="text-muted-foreground">A menu opened in a dialog climbs above it.</div>
        </div>
        <span aria-expanded className={`${control} w-fit border surface-control`}>
          Member <Icon name="chevron-down" className="size-3.5" />
        </span>
        <div className="w-full max-w-48 rounded-xl border surface-overlay p-1 [--surface-face:var(--surface-top)]">
          {["Owner", "Member", "Restricted"].map((item, index) => (
            <div key={item} className={`rounded-md px-2 py-1.5 ${index === 1 ? "bg-accent" : ""}`}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  </Canvas>
);

export default Example;
