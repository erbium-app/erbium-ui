import { useAsyncDebouncer } from "@tanstack/react-pacer/async-debouncer";
import type { ComponentProps } from "react";
import { StatefulButton } from "@erbium/ui/components/stateful-button";

export function AsyncStatefulButton({
  children,
  successLabel,
  variant,
}: {
  children: string;
  successLabel: string;
  variant?: ComponentProps<typeof StatefulButton>["variant"];
}) {
  const request = useAsyncDebouncer(async () => {}, { wait: 1200 });

  return (
    <StatefulButton
      variant={variant}
      onClick={async () => {
        await request.maybeExecute();
      }}
      successLabel={successLabel}
    >
      {children}
    </StatefulButton>
  );
}

export default function StatefulButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <AsyncStatefulButton successLabel="Saved">Save</AsyncStatefulButton>
      <AsyncStatefulButton successLabel="Updated" variant="outline">
        Update
      </AsyncStatefulButton>
    </div>
  );
}
