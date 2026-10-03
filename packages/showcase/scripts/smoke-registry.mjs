import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const fixture = await mkdtemp(join(tmpdir(), "erbium-registry-"));
const dependencies = {};
for (const directory of [root, join(root, "../ui")]) {
  const pkg = JSON.parse(await readFile(join(directory, "package.json"), "utf8"));
  for (const [name, version] of Object.entries(pkg.dependencies)) {
    if (!version.startsWith("workspace:")) dependencies[name] = version;
  }
}
Object.assign(dependencies, {
  "@storybook/react": "10.6.1",
  "@types/react": "^19.3.0",
  "@types/react-dom": "^19.3.0",
  typescript: "^7.0.2",
});
async function json(path, value) {
  await writeFile(join(fixture, path), `${JSON.stringify(value, null, 2)}\n`);
}
await mkdir(join(fixture, "src"));
await writeFile(join(fixture, "src/app.css"), '@import "tailwindcss";\n');
await json("package.json", {
  name: "erbium-registry-consumer",
  private: true,
  type: "module",
  dependencies,
});
await json("tsconfig.json", {
  compilerOptions: {
    target: "es2023",
    module: "esnext",
    moduleResolution: "bundler",
    jsx: "react-jsx",
    strict: true,
    skipLibCheck: true,
    noEmit: true,
    paths: { "@/*": ["./src/*"] },
  },
  include: ["src"],
});
const server = createServer(async (request, response) => {
  const match = request.url?.match(/^\/(ui|examples)\/([\w-]+)\.json$/);
  if (!match) {
    response.writeHead(404).end();
    return;
  }
  const directory = match[1] === "ui" ? join(root, "../ui/public/r") : join(root, "public/r");
  try {
    const source = await readFile(join(directory, `${match[2]}.json`));
    response.setHeader("Content-Type", "application/json");
    response.end(source);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
if (!address || typeof address === "string") throw new Error("Registry server did not start.");
const host = `http://127.0.0.1:${address.port}`;
try {
  await json("components.json", {
    $schema: "https://ui.shadcn.com/schema.json",
    style: "base-nova",
    rsc: false,
    tsx: true,
    iconLibrary: "hugeicons",
    tailwind: { config: "", css: "src/app.css", baseColor: "neutral", cssVariables: true },
    aliases: {
      components: "@/shared/widgets",
      ui: "@/shared/primitives",
      utils: "@/common/classnames",
      lib: "@/common/lib",
      hooks: "@/common/hooks",
    },
    registries: {
      "@erbium": `${host}/ui/{name}.json`,
      "@erbium-examples": `${host}/examples/{name}.json`,
    },
  });
  const run = promisify(execFile);
  console.log(`Installing a separate React consumer in ${fixture}`);
  await run("bun", ["install", "--ignore-scripts"], { cwd: fixture, maxBuffer: 10_000_000 });
  const items = process.argv.includes("--all")
    ? JSON.parse(await readFile(join(root, "manifest.json"), "utf8")).map(
        (entry) => `${entry.name}-stories`,
      )
    : [
        "checkbox-stories",
        "toast-stories",
        "command-stories",
        "table-playground",
        "item-joined-selection",
      ];
  console.log(`Installing ${items.length} showcase items with shadcn and custom aliases.`);
  await run(
    join(root, "node_modules/.bin/shadcn"),
    [
      "add",
      ...items.map((name) => `@erbium-examples/${name}`),
      "--cwd",
      fixture,
      "--yes",
      "--overwrite",
    ],
    { cwd: fixture, maxBuffer: 10_000_000 },
  );
  await run(join(fixture, "node_modules/.bin/tsc"), ["--noEmit"], {
    cwd: fixture,
    maxBuffer: 10_000_000,
  });
  console.log(`Registry installation and consumer typecheck passed. Fixture: ${fixture}`);
} catch (error) {
  console.error(error.stdout || error.stderr || error.message);
  throw error;
} finally {
  await new Promise((resolve) => server.close(resolve));
}
