import { ButtonShortcut } from "@erbium/ui/components/button";
import { DirectionProvider } from "@erbium/ui/components/direction";
import { StatefulButton } from "@erbium/ui/components/stateful-button";
import { AsyncStatefulButton } from "../examples/stateful-button-demo";

const Example = () => (
  <div className="flex flex-col gap-4">
    {(["ltr", "rtl"] as const).map((direction) => {
      const isRtl = direction === "rtl";
      const label = isRtl ? "حفظ" : "Save";
      const successLabel = isRtl ? "تم الحفظ" : "Saved";

      return (
        <DirectionProvider direction={direction} key={direction}>
          <div dir={direction} className="rounded-lg border p-4">
            <p className="mb-3 text-caption font-medium uppercase">{direction}</p>
            <div className="flex flex-wrap gap-3">
              <AsyncStatefulButton successLabel={successLabel}>{label}</AsyncStatefulButton>
              <StatefulButton successLabel={successLabel} variant="outline">
                {label}
                <ButtonShortcut hotkey="Mod+S" />
              </StatefulButton>
              <StatefulButton state="loading" successLabel={successLabel}>
                {label}
                <ButtonShortcut hotkey="Mod+S" />
              </StatefulButton>
              <StatefulButton state="success" successLabel={successLabel}>
                {label}
                <ButtonShortcut hotkey="Mod+S" />
              </StatefulButton>
              <StatefulButton state="success" successLabel={successLabel} variant="outline">
                {label}
              </StatefulButton>
            </div>
          </div>
        </DirectionProvider>
      );
    })}
  </div>
);

export default Example;
