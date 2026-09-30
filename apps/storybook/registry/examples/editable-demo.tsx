// @ts-nocheck
import { useState } from "react";
import { Editable, EditableInput, EditablePreview } from "../components/editable";
import { Kbd, KbdGroup } from "../components/kbd";

export default function EditableDemo() {
  const [name, setName] = useState("Overview");

  return (
    <div className="flex w-96 items-center gap-2 rounded-lg border border-surface-rim p-2 text-sm">
      <span className="shrink-0 text-muted-foreground">Tab</span>
      <Editable value={name} onValueChange={setName} className="min-w-0 flex-1 font-medium">
        <EditablePreview aria-label="Rename tab" />
        <EditableInput aria-label="Tab name" maxLength={48} />
      </Editable>
      <KbdGroup className="shrink-0">
        <Kbd>Enter</Kbd>
        <Kbd>Esc</Kbd>
      </KbdGroup>
    </div>
  );
}
