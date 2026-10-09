import TextareaAutosize from "react-textarea-autosize";

import { InputGroup, InputGroupAddon, InputGroupButton } from "@erbium/ui/components/input-group";

export default function InputGroupCustom() {
  return (
    <div className="grid w-full max-w-sm gap-section">
      <InputGroup>
        <TextareaAutosize
          data-slot="input-group-control"
          className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-body transition-field outline-none md:text-caption"
          placeholder="Autoresize textarea..."
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton className="ml-auto" size="sm" variant="default">
            Submit
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
