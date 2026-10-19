import { parsePatchFiles } from "@pierre/diffs";
import { DiffView } from "@erbium/ui/blocks/diff-view";

const patch = `diff --git a/settings.json b/settings.json
--- a/settings.json
+++ b/settings.json
@@ -1,3 +1,4 @@
 {
-  "theme": "light"
+  "theme": "system",
+  "wrap": true
 }
`;

const fileDiff = parsePatchFiles(patch, "settings-patch", true)[0]?.files[0];

export default function Example() {
  if (!fileDiff) {
    return null;
  }

  return (
    <DiffView className="w-full max-w-4xl" fileDiff={fileDiff} options={{ diffStyle: "unified" }} />
  );
}
