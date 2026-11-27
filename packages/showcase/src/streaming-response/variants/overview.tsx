import { useCallback, useEffect } from "react";
import { StreamingResponse, useTextStream } from "@erbium/ui/blocks/streaming-response";
import { Button } from "@erbium/ui/components/button";
import { simulateStream } from "../../streaming";

const reply = `## Retry with backoff

Retry only requests that are **safe to repeat**, and wait longer after each failure:

\`\`\`ts
const retry = async <T>(request: () => Promise<T>, attempts = 3): Promise<T> => {
  try {
    return await request();
  } catch (error) {
    if (attempts <= 1) throw error;
    await new Promise((resolve) => setTimeout(resolve, 2 ** (4 - attempts) * 250));
    return retry(request, attempts - 1);
  }
};
\`\`\`

| Attempt | Wait before it |
| ------: | -------------: |
|       1 |           none |
|       2 |         500 ms |
|       3 |       1,000 ms |

Add random *jitter* when many clients can fail at once.
`;

export default function StreamingResponseExample() {
  const { error, start, status, stop, text } = useTextStream();
  const busy = status === "pending" || status === "streaming";

  const ask = useCallback(() => {
    void start((signal) => simulateStream(reply, { signal }));
  }, [start]);

  useEffect(() => {
    ask();
  }, [ask]);

  return (
    <div className="grid w-full max-w-xl gap-group">
      <Button
        className="justify-self-start"
        variant="outline"
        size="sm"
        onClick={busy ? stop : ask}
      >
        {busy ? "Stop" : "Replay"}
      </Button>
      <StreamingResponse text={text} status={status} error={error?.message} />
    </div>
  );
}
