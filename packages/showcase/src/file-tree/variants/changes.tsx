import {
  FileTree,
  useFileTree,
  FileTreeHeader,
  FileTreeTitle,
  FileTreeActions,
  FileTreeContent,
} from "@erbium/ui/blocks/file-tree";
import { Button } from "@erbium/ui/components/button";
import { paths } from "../examples/paths";

export default function Example() {
  const { model } = useFileTree({
    gitStatus: [
      { path: "src/blocks/file-view.tsx", status: "added" },
      { path: "src/styles/surfaces.css", status: "modified" },
    ],
    initialExpansion: "open",
    paths,
  });

  return (
    <FileTree model={model} className="w-80" aria-label="Changed project files">
      <FileTreeHeader>
        <FileTreeTitle>Changes</FileTreeTitle>
        <FileTreeActions>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => {
              model.add("src/blocks/file-tree.tsx");
            }}
          >
            Add file
          </Button>
        </FileTreeActions>
      </FileTreeHeader>
      <FileTreeContent />
    </FileTree>
  );
}
