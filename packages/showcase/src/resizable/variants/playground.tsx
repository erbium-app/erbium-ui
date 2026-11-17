import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@erbium/ui/components/resizable";

export const defaultProps = {
  firstPanelSize: 50,
  orientation: "horizontal",
  showHandle: true,
} satisfies {
  orientation: "horizontal" | "vertical";
  firstPanelSize: number;
  showHandle: boolean;
};

export default function ResizablePlaygroundExample(
  args: {
    orientation: "horizontal" | "vertical";
    firstPanelSize: number;
    showHandle: boolean;
  } = defaultProps,
) {
  return (
    <ResizablePanelGroup
      key={`${args.orientation}-${args.firstPanelSize}`}
      orientation={args.orientation}
      className="h-48 w-80 rounded-xl border surface-panel"
    >
      <ResizablePanel
        defaultSize={`${args.firstPanelSize}%`}
        className="flex items-center justify-center"
      >
        First
      </ResizablePanel>
      <ResizableHandle withHandle={args.showHandle} />
      <ResizablePanel
        defaultSize={`${100 - args.firstPanelSize}%`}
        className="flex items-center justify-center"
      >
        Second
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
