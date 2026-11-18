import { useState } from "react";
import {
  DiffView,
  DiffViewHeader,
  DiffViewTitle,
  DiffViewStats,
  DiffViewActions,
  DiffViewCopyButton,
  DiffViewContent,
} from "@erbium/ui/blocks/diff-view";
import { CopyButtonIcon, CopyButtonLabel } from "@erbium/ui/blocks/copy-button";
import { Toggle } from "@erbium/ui/components/toggle";
import { oldFile, newFile } from "../examples/files";

export default function DiffViewCompositionExample() {
  const [unified, setUnified] = useState(false);

  return (
    <DiffView
      className="w-full"
      oldFile={oldFile}
      newFile={newFile}
      options={{ diffStyle: unified ? "unified" : "split" }}
    >
      <DiffViewHeader>
        <div className="flex min-w-0 items-center gap-3">
          <DiffViewTitle />
          <DiffViewStats />
        </div>
        <DiffViewActions>
          <Toggle pressed={unified} onPressedChange={setUnified} size="sm">
            Unified
          </Toggle>
          <DiffViewCopyButton side="old">
            <CopyButtonIcon />
            <CopyButtonLabel>Copy before</CopyButtonLabel>
          </DiffViewCopyButton>
          <DiffViewCopyButton>
            <CopyButtonIcon />
            <CopyButtonLabel>Copy after</CopyButtonLabel>
          </DiffViewCopyButton>
        </DiffViewActions>
      </DiffViewHeader>
      <DiffViewContent className="max-h-80" />
    </DiffView>
  );
}
