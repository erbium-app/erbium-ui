import { useCallback, useEffect } from "react";
import { CopyButton } from "@erbium/ui/blocks/copy-button";
import {
  StreamingResponse,
  StreamingResponseActions,
  StreamingResponseContent,
  StreamingResponseError,
  StreamingResponsePending,
  useTextStream,
} from "@erbium/ui/blocks/streaming-response";
import { Button } from "@erbium/ui/components/button";
import { Icon } from "@erbium/ui/components/icon";
import { simulateStream } from "../../streaming";

const reply = `A **stop** keeps the text that has arrived and finishes the response, so its
actions appear. Retry reads a new stream from the start.`;

export default function StreamingResponseActionsExample() {
  const { error, start, status, stop, text } = useTextStream();

  const ask = useCallback(() => {
    void start((signal) => simulateStream(reply, { interval: 80, signal }));
  }, [start]);

  useEffect(() => {
    ask();
  }, [ask]);

  return (
    <StreamingResponse className="max-w-md" text={text} status={status} error={error?.message}>
      <StreamingResponsePending>Reading the docs…</StreamingResponsePending>
      <StreamingResponseContent />
      <StreamingResponseError />
      {status === "pending" || status === "streaming" ? (
        <Button className="self-start" variant="outline" size="sm" onClick={stop}>
          Stop
        </Button>
      ) : null}
      <StreamingResponseActions>
        <CopyButton value={text} aria-label="Copy response" />
        <Button variant="ghost" size="icon" aria-label="Retry" title="Retry" onClick={ask}>
          <Icon name="refresh-ccw" />
        </Button>
      </StreamingResponseActions>
    </StreamingResponse>
  );
}
