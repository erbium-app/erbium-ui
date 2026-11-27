import { StreamingResponse } from "@erbium/ui/blocks/streaming-response";
import type { ResponseStatus } from "@erbium/ui/blocks/streaming-response";

const states: { status: ResponseStatus; text: string; error?: string }[] = [
  { status: "pending", text: "" },
  { status: "streaming", text: "Reading the **configuration" },
  { status: "complete", text: "The configuration is valid." },
  {
    error: "The connection closed before the reply finished.",
    status: "error",
    text: "The first two files are valid, and",
  },
];

export default function StreamingResponseStatesExample() {
  return (
    <dl className="grid w-full max-w-md gap-section">
      {states.map(({ error, status, text }) => (
        <div key={status} className="grid gap-related">
          <dt className="font-mono text-metadata text-muted-foreground">{status}</dt>
          <dd>
            <StreamingResponse status={status} text={text} error={error} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
