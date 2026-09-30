// @ts-nocheck
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../components/resizable";

export default function ResizableDemo() {
  return (
    <ResizablePanelGroup
      orientation="vertical"
      className="min-h-50 max-w-md rounded-xl border border-surface-border bg-surface-panel shadow-panel md:min-w-112.5"
    >
      <ResizablePanel defaultSize="25%">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Header</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="75%">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
