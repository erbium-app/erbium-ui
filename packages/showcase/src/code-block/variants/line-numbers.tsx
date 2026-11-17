import { CodeBlock } from "@erbium/ui/blocks/code-block";

const excerpt = `export const createServer = (options: ServerOptions) => {
  const server = http.createServer(options.handler);

  server.listen(options.port);

  return server;
};
`;

const message =
  "The server could not start because port 3000 is already in use. Stop the other process or set a different port in server.config.ts.";

export default function CodeBlockLineNumbersExample() {
  return (
    <div className="grid w-full max-w-xl gap-group">
      <CodeBlock code={excerpt} language="ts" title="server.ts" lineNumbers startLine={42} />
      <CodeBlock code={message} language="text" title="Wrapped lines" lineNumbers wrap />
      <CodeBlock
        code={Array.from({ length: 12 }, (_, index) => `log.info("step ${index + 995}");`).join(
          "\n",
        )}
        language="js"
        title="Wider numbers"
        lineNumbers
        startLine={995}
      />
    </div>
  );
}
