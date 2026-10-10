import {
  FileTree,
  useFileTree,
  FileTreeHeader,
  FileTreeTitle,
  FileTreeActions,
  FileTreeContent,
} from "@erbium/ui/blocks/file-tree";
import { Button } from "@erbium/ui/components/button";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "@erbium/ui/components/sidebar";
import { paths } from "../examples/paths";
export default function Example() {
  const { model } = useFileTree({ paths, initialExpansion: 1, search: true });
  return (
    <SidebarProvider className="min-h-0 w-80">
      <Sidebar collapsible="none" className="w-full">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <FileTree model={model} aria-label="Project files">
                <FileTreeHeader>
                  <FileTreeTitle>Project files</FileTreeTitle>
                  <FileTreeActions>
                    <Button variant="ghost" size="xs" onClick={() => model.openSearch()}>
                      Find file
                    </Button>
                  </FileTreeActions>
                </FileTreeHeader>
                <FileTreeContent className="h-96" />
              </FileTree>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
