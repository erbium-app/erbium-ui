import { DiffView } from "@erbium/ui/blocks/diff-view";

const before = `${Array.from(
  { length: 80 },
  (_, index) => `export const value${index + 1} = ${index + 1};`,
).join("\n")}\n`;

const after = before.replace("value40 = 40", "value40 = 400");
const oldFile = { contents: before, name: "values.ts" };
const newFile = { contents: after, name: "values.ts" };

export default function DiffViewContextExample() {
  return (
    <DiffView
      className="w-full max-w-4xl"
      oldFile={oldFile}
      newFile={newFile}
      options={{ expansionLineCount: 10, parseDiffOptions: { context: 3 } }}
    />
  );
}
