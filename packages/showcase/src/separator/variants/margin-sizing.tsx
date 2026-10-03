import { Separator } from "@erbium/ui/components/separator";

const Example = () => (
  <div className="grid gap-6">
    {(["ltr", "rtl"] as const).map((direction) => (
      <div key={direction} dir={direction} className="grid gap-3">
        {(["block", "flex flex-col items-center", "grid justify-items-center"] as const).map(
          (layout) => (
            <div
              key={layout}
              data-separator-case
              className={`w-72 gap-2 bg-surface-panel p-4 ${layout}`}
            >
              <span className="text-sm">
                {direction}: {layout}
              </span>
              <Separator data-inset="0" className="-mx-4" />
              <Separator data-inset="24" className="mx-2" />
              <Separator data-inset="0" className="-mx-4">
                Labeled
              </Separator>
            </div>
          ),
        )}
      </div>
    ))}
  </div>
);

export default Example;
