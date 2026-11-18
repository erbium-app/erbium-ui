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

export default function DiffViewPatchExample() {
  return <DiffView className="w-full" patch={patch} options={{ diffStyle: "unified" }} />;
}
