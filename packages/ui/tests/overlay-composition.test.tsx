import { render, screen } from "@testing-library/react";
import { expect, test } from "vite-plus/test";
import { Dialog, DialogContent, DialogPanel } from "@erbium/ui/components/dialog";
import { DrawerContent } from "@erbium/ui/components/drawer";
import { SheetContent } from "@erbium/ui/components/sheet";
import { Command, CommandDialog } from "@erbium/ui/components/command";

test("content sections cannot be used outside their panel", () => {
  expect(() => render(<DialogContent />)).toThrow("DialogContent must be used inside DialogPanel.");
  expect(() => render(<SheetContent />)).toThrow("SheetContent must be used inside SheetPanel.");
  expect(() => render(<DrawerContent />)).toThrow("DrawerContent must be used inside DrawerPanel.");
});

test("command dialog keeps its command inside the required dialog body", () => {
  render(
    <CommandDialog defaultOpen>
      <Command>Search results</Command>
    </CommandDialog>,
  );
  const panel = screen.getByRole("dialog");
  expect(panel.querySelector('[data-slot="dialog-content"] [data-slot="command"]')).toBeTruthy();
});

test("dialog panel can use Base UI rendering to make the popup a form", () => {
  render(
    <Dialog defaultOpen>
      <DialogPanel render={<form />} showCloseButton={false}>
        <DialogContent>Fields</DialogContent>
      </DialogPanel>
    </Dialog>,
  );
  expect(screen.getByRole("dialog").tagName).toBe("FORM");
});
