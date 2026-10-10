import { DiffView } from "@erbium/ui/blocks/diff-view";

const before =
  Array.from({ length: 80 }, (_, index) => `export const value${index + 1} = ${index + 1};`).join(
    "\n",
  ) + "\n";
const after = before.replace("value40 = 40", "value40 = 400");
const oldFile = { name: "values.ts", contents: before };
const newFile = { name: "values.ts", contents: after };

export default function Example() {
  return (
    <DiffView
      className="w-full max-w-4xl"
      oldFile={oldFile}
      newFile={newFile}
      options={{ expansionLineCount: 10, parseDiffOptions: { context: 3 } }}
    />
  );
}
