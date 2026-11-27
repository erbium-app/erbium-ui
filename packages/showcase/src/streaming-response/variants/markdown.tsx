import { StreamingResponse, StreamingResponseContent } from "@erbium/ui/blocks/streaming-response";

const reply = `# Release checklist

Text can be **bold**, *italic*, ~~struck through~~ or \`inline code\`, and can link to
[another page](/docs/introduction) or [another site](https://example.com).

## Steps

1. Run the tests
2. Build the packages
   - types
   - JavaScript

- [x] Changelog written
- [ ] Version tagged

> Publish from a clean checkout, so nothing uncommitted ships.

> [!WARNING]
> A published version cannot be replaced.

\`\`\`ts title="release.ts"
const version: string = "1.4.0";

export const tag = (name = version) => \`v\${name}\`;
\`\`\`

\`\`\`diff
- "version": "1.3.0"
+ "version": "1.4.0"
\`\`\`

| Package | Size | Status |
| :------ | ---: | :----: |
| core    | 4 kB |  ready |
| react   | 9 kB |  ready |

---

The build time grows roughly as $O(n \\log n)$.[^1]

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

[^1]: Measured on the packages above.
`;

export default function StreamingResponseMarkdownExample() {
  return (
    <StreamingResponse className="max-w-xl" text={reply}>
      <StreamingResponseContent math />
    </StreamingResponse>
  );
}
