import { useEffect, useState } from "react";
import { CodeBlock } from "@erbium/ui/blocks/code-block";
import { Button } from "@erbium/ui/components/button";

const source = `// Answers every request with its path.
const server = createServer((request, response) => {
  response.writeHead(200, { "content-type": "application/json" });
  response.end(JSON.stringify({ path: request.url, ok: true }));
});

server.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
`;

// Characters added per tick, roughly the pace of a streamed response.
const chunkSize = 6;

const StreamedSource = () => {
  const [length, setLength] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLength((current) => Math.min(current + chunkSize, source.length));
    }, 30);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <CodeBlock code={source.slice(0, length)} language="ts" title="server.ts" lineNumbers />;
};

export default function CodeBlockStreamingExample() {
  const [run, setRun] = useState(0);

  return (
    <div className="grid w-full max-w-xl gap-related">
      <StreamedSource key={run} />
      <Button
        variant="outline"
        size="sm"
        className="justify-self-start"
        onClick={() => {
          setRun((current) => current + 1);
        }}
      >
        Replay
      </Button>
    </div>
  );
}
