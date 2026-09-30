// @ts-nocheck
import { useAsyncDebouncer } from "@tanstack/react-pacer/async-debouncer";
import type { ComponentProps } from "react";
import { StatusButton } from "../components/status-button";

export function AsyncStatusButton({
  children,
  successLabel,
  variant,
}: {
  children: string;
  successLabel: string;
  variant?: ComponentProps<typeof StatusButton>["variant"];
}) {
  const request = useAsyncDebouncer(async () => {}, { wait: 1200 });

  return (
    <StatusButton
      variant={variant}
      onClick={async () => {
        await request.maybeExecute();
      }}
      successLabel={successLabel}
    >
      {children}
    </StatusButton>
  );
}

export default function StatusButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <AsyncStatusButton successLabel="Saved">Save</AsyncStatusButton>
      <AsyncStatusButton successLabel="Updated" variant="outline">
        Update
      </AsyncStatusButton>
    </div>
  );
}
