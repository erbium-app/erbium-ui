import { useCallback, useEffect } from "react";
import {
  StreamingResponse,
  StreamingResponseContent,
  useTextStream,
} from "@erbium/ui/blocks/streaming-response";
import type { StreamingResponseIslands } from "@erbium/ui/blocks/streaming-response";
import { Button } from "@erbium/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@erbium/ui/components/card";
import { simulateStream } from "../../streaming";

// Island data is model output, so each field is checked before it is shown.
const isText = (value: unknown): value is string =>
  // oxlint-disable-next-line anti-slop/no-runtime-typeof -- this is where model output is parsed.
  typeof value === "string";

// Defined outside the component, so the response is not formatted again on each render.
const islands: StreamingResponseIslands = {
  deployment: {
    pending: "Preparing the deployment…",
    // The data is model output: check it, and return null to show it as code instead.
    render: ({ id, service, version }) =>
      isText(service) && isText(version) ? (
        <Card key={id} size="sm" className="not-typeset my-4">
          <CardHeader>
            <CardTitle>Deploy {service}</CardTitle>
            <CardDescription>Version {version} is ready.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="sm">Review changes</Button>
          </CardContent>
        </Card>
      ) : null,
  },
};

const reply = `The build passed. Confirm the deployment below.

\`\`\`island-deployment
{ "id": "api-1.4.0", "service": "api", "version": "1.4.0" }
\`\`\`

Nothing ships until you confirm it.
`;

export default function StreamingResponseCustomUiExample() {
  const { start, status, text } = useTextStream();

  const ask = useCallback(() => {
    void start((signal) => simulateStream(reply, { signal }));
  }, [start]);

  useEffect(() => {
    ask();
  }, [ask]);

  return (
    <div className="grid w-full max-w-md gap-group">
      <Button className="justify-self-start" variant="outline" size="sm" onClick={ask}>
        Replay
      </Button>
      <StreamingResponse text={text} status={status}>
        <StreamingResponseContent islands={islands} />
      </StreamingResponse>
    </div>
  );
}
