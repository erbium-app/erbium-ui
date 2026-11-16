import assert from "node:assert/strict";
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { access, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { once } from "node:events";
import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import * as Schema from "effect/Schema";
import { test } from "node:test";
import { hash, parseJson, revision, snapshotFor } from "../src/revision.ts";

const record = Schema.decodeUnknownSync(Schema.Record(Schema.String, Schema.Json));
const bin = path.resolve(import.meta.dirname, "../dist/index.js");
const source = path.join("src", "primitives", "button.tsx");
const base = 'export const label = "base";\n\n\n\nexport const style = "base";\n';

const fixture = async () => {
  const root = await mkdtemp(path.join(tmpdir(), "erbium-test-"));
  const project = path.join(root, "app");
  const registry = path.join(root, "registry");
  await mkdir(path.join(project, "src", "primitives"), { recursive: true });
  await mkdir(path.join(registry, "revisions"), { recursive: true });
  await Promise.all([
    writeFile(path.join(project, "package.json"), JSON.stringify({ name: "cli-fixture" })),
    writeFile(
      path.join(project, "components.json"),
      JSON.stringify({
        tsx: true,
        aliases: { components: "@app/components", ui: "@app/primitives" },
      }),
    ),
    writeFile(
      path.join(project, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: { paths: { "@app/*": ["./src/*"] } },
      }),
    ),
  ]);

  const release = async (content: string, shared?: string) => {
    const sources =
      shared === undefined
        ? [["@erbium/button", "button", content]]
        : [
            ["@erbium/button", "button", content],
            ["@erbium-examples/button-demo", "button-demo", shared],
          ];

    const entries = await Promise.all(
      sources.map(async ([id, name, code]) => {
        const item = snapshotFor(id, {
          name,
          type: "registry:ui",
          files: [
            {
              path: "src/button.tsx",
              target: "@ui/button.tsx",
              type: "registry:ui",
              content: code,
            },
          ],
        });

        const digest = revision(item);
        await writeFile(path.join(registry, "revisions", `${digest}.json`), JSON.stringify(item));

        return [id, digest] as const;
      }),
    );

    const items = Object.fromEntries(entries);
    await writeFile(path.join(registry, "index.json"), JSON.stringify({ version: 1, items }));

    return items;
  };

  const args = (...command: string[]) => [
    bin,
    ...command,
    "--cwd",
    project,
    "--registry",
    registry,
  ];

  const run = (...command: string[]) =>
    execFileSync(process.execPath, args(...command), { encoding: "utf-8" });

  const fail = (...command: string[]) =>
    spawnSync(process.execPath, args(...command), { encoding: "utf-8" });

  await release(base);

  return { root, project, registry, release, run, fail };
};

void test("adopts an existing file, then merges successive revisions and refuses overlapping edits", async (context) => {
  const { root, project, release, run, fail } = await fixture();
  context.after(async () => {
    await rm(root, { recursive: true, force: true });
  });
  const file = path.join(project, source);
  await release(`/* Registry-only leading comment. */\n${base}`);
  await writeFile(file, base);
  run("adopt", "button");
  assert.equal(await readFile(file, "utf-8"), base);

  const local = base.replace('label = "base"', 'label = "local"');
  const upstream = base.replace('style = "base"', 'style = "new"');
  await writeFile(file, local);
  await release(upstream);
  assert.match(run("status", "--json"), /"updateAvailable": true/u);
  assert.match(run("diff", "button"), /style = "new"/u);
  assert.match(run("diff", "button", "--local"), /label = "local"/u);
  run("update", "--dry-run");
  assert.equal(await readFile(file, "utf-8"), local);
  run("update");
  assert.equal(
    await readFile(file, "utf-8"),
    upstream.replace('label = "base"', 'label = "local"'),
  );

  const next = upstream.replace('style = "new"', 'style = "newer"');
  await release(next);
  run("update");
  const merged = next.replace('label = "base"', 'label = "local"');
  assert.equal(await readFile(file, "utf-8"), merged);

  await release(next.replace('label = "base"', 'label = "upstream"'));
  const lock = path.join(project, ".erbium", "lock.json");
  const previousLock = await readFile(lock, "utf-8");
  const conflict = fail("update");
  assert.notEqual(conflict.status, 0);
  assert.match(conflict.stdout + conflict.stderr, /Both sides edited the same lines/u);
  assert.equal(await readFile(file, "utf-8"), merged);
  assert.equal(await readFile(lock, "utf-8"), previousLock);
  assert.match(run("check", "--json"), /"modified": true/u);

  assert.match(run("update", "--conflict-markers", "--dry-run"), /Would write conflict markers/u);
  assert.equal(await readFile(file, "utf-8"), merged);
  assert.equal(await readFile(lock, "utf-8"), previousLock);
  assert.notEqual(fail("update", "--overwrite", "--conflict-markers").status, 0);
  assert.match(run("update", "--conflict-markers"), /Wrote conflict markers/u);
  assert.match(await readFile(file, "utf-8"), /^<<<<<<< yours$/mu);
  const check = fail("check");
  assert.notEqual(check.status, 0);
  assert.match(check.stdout, /Unresolved merge conflict/u);

  run("update", "button", "--overwrite");
  assert.equal(await readFile(file, "utf-8"), next.replace('label = "base"', 'label = "upstream"'));
  run("check");
});

void test("adds a tracked file and reports missing files offline", async (context) => {
  const { root, project, run, fail } = await fixture();
  context.after(async () => {
    await rm(root, { recursive: true, force: true });
  });
  const file = path.join(project, source);
  run("add", "button");
  assert.equal(await readFile(file, "utf-8"), base);
  run("check");
  await rm(file);
  const check = fail("check");
  assert.notEqual(check.status, 0);
  assert.match(check.stdout + check.stderr, /Missing files/u);
});

void test("tracks shared files once and requires shared updates to agree", async (context) => {
  const { root, project, release, run, fail } = await fixture();
  context.after(async () => {
    await rm(root, { recursive: true, force: true });
  });

  const file = path.join(project, source);
  await release(base, base);
  run("add", "button", "@erbium-examples/button-demo");
  assert.equal(await readFile(file, "utf-8"), base);

  const upstream = base.replace('style = "base"', 'style = "shared"');
  await release(upstream, upstream);
  const conflict = fail("update", "button");
  assert.notEqual(conflict.status, 0);
  assert.match(conflict.stdout + conflict.stderr, /Update the affected items together/u);
  assert.equal(await readFile(file, "utf-8"), base);

  run("update");
  assert.equal(await readFile(file, "utf-8"), upstream);
  run("check");
});

void test("initializes, discovers historical revisions, and recovers a missing stored baseline", async (context) => {
  const { root, project, registry, release, run } = await fixture();
  context.after(async () => {
    await rm(root, { recursive: true, force: true });
  });

  const before = await release(base);
  const upstream = base.replace('style = "base"', 'style = "upstream"');
  const after = await release(upstream);
  const oldCommit = "a".repeat(40);

  await writeFile(
    path.join(registry, "history.json"),
    JSON.stringify([
      { commit: "b".repeat(40), date: "2026-11-02", changes: after },
      { commit: oldCommit, date: "2026-11-01", changes: before },
    ]),
  );

  execFileSync(process.execPath, [bin, "init", "--cwd", project, "--agents"]);
  const agents = await readFile(path.join(project, "AGENTS.md"), "utf-8");
  execFileSync(process.execPath, [bin, "init", "--cwd", project, "--agents"]);
  assert.equal(await readFile(path.join(project, "AGENTS.md"), "utf-8"), agents);
  assert.match(run("search", "button", "--json"), /@erbium\/button/u);
  assert.match(run("history", "button", "--json"), new RegExp(oldCommit, "u"));

  const file = path.join(project, source);
  await writeFile(file, base);
  run("adopt", "button", "--at", oldCommit);
  await rm(path.join(project, ".erbium", "bases", `${hash(base)}.txt`));
  const local = base.replace('label = "base"', 'label = "local"');
  await writeFile(file, local);
  run("update");
  assert.equal(
    await readFile(file, "utf-8"),
    local.replace('style = "base"', 'style = "upstream"'),
  );
});

void test("checks local imports offline and reports usage from Git", async (context) => {
  const { root, project, run, fail } = await fixture();
  context.after(async () => {
    await rm(root, { recursive: true, force: true });
  });

  execFileSync("git", ["-C", project, "init", "--quiet"], { cwd: project });
  run("add", "button");
  const importer = path.join(project, "src", "consumer.tsx");
  await writeFile(importer, 'import { label } from "@app/primitives/button";\nexport { label };\n');
  assert.match(run("usage", "--offline", "--json"), /src\/consumer.tsx/u);

  const app = path.join(project, "apps", "consumer");
  await mkdir(app, { recursive: true });
  await writeFile(path.join(app, "package.json"), '{"name":"fixture-app"}');
  await writeFile(path.join(app, "index.ts"), 'export { label } from "../../src/consumer";\n');
  assert.match(
    run("usage", "--offline", "--json"),
    /"usedByProjects"\s*:\s*\[[^\]]*"apps\/consumer"/u,
  );

  const target = path.join(project, source);
  await writeFile(target, `import "./missing";\n${base}`);
  const check = fail("check", "--only", "imports", "--json");
  assert.notEqual(check.status, 0);
  assert.match(check.stdout, /does not resolve/u);
  assert.doesNotMatch(check.stdout, /"step"\s*:\s*"provenance"/u);
  run("check", "--only", "provenance");
});

void test("builds and validates managed and shadcn artifacts from a catalog", async (context) => {
  const { root, project } = await fixture();
  context.after(async () => {
    await rm(root, { recursive: true, force: true });
  });

  const catalog = path.join(root, "registry.json");
  const out = path.join(root, "published");

  await writeFile(
    catalog,
    JSON.stringify({
      name: "erbium",
      items: [
        {
          name: "button",
          type: "registry:ui",
          title: "Button",
          keywords: ["action"],
          files: [
            {
              path: "src/button.tsx",
              target: "@ui/button.tsx",
              type: "registry:ui",
              content: base,
            },
          ],
        },
      ],
    }),
  );

  const invoke = (...args: string[]) =>
    execFileSync(process.execPath, [bin, ...args, "--cwd", project], { encoding: "utf-8" });

  assert.match(invoke("registry", "build", catalog, "--out", out), /Built 1 items/u);
  await readFile(path.join(out, "r", "ui", "button.json"));
  const location = path.join(out, "r", "erbium");
  assert.match(invoke("registry", "validate", "--registry", location), /Validated 1 items/u);
  assert.match(invoke("search", "action", "--registry", location), /@erbium\/button/u);

  const docs = invoke("docs", "button", "--registry", location);
  assert.match(docs, /^# Button/u);
  assert.ok(docs.includes(base));

  invoke("add", "button", "--registry", location);
  execFileSync("git", ["-C", project, "init", "--quiet"]);
  const usageFile = path.join(root, "consumers.json");
  const verifyFile = path.join(root, "checks.json");
  const storybook = path.join(root, "storybook-static");
  await mkdir(path.join(storybook, "assets"), { recursive: true });
  await Promise.all([
    writeFile(usageFile, invoke("usage", "--offline", "--json")),
    writeFile(verifyFile, invoke("check", "--json")),
    writeFile(path.join(storybook, "iframe.html"), "<!doctype html>"),
    writeFile(path.join(storybook, "assets", "font.woff2"), new Uint8Array([0, 255, 1])),
    writeFile(
      path.join(storybook, "index.json"),
      JSON.stringify({
        v: 5,
        entries: {
          "components-button--default": {
            type: "story",
            id: "components-button--default",
            name: "Default",
            importPath: "./src/stories/button.stories.tsx",
          },
        },
      }),
    ),
  ]);

  const build = ["registry", "build", catalog, "--out", out];
  invoke(...build, "--storybook", storybook, "--usage", usageFile, "--verify", verifyFile);
  assert.match(
    await readFile(path.join(out, "items", "erbium", "button.html"), "utf-8"),
    /iframe\.html\?id=components-button--default/u,
  );
  assert.match(await readFile(path.join(out, "index.html"), "utf-8"), /usage\.json.*Usage report/u);
  assert.match(
    await readFile(path.join(out, "index.html"), "utf-8"),
    /verify\.json.*Verification report/u,
  );
  assert.deepEqual(await readFile(path.join(out, "usage.json")), await readFile(usageFile));
  assert.deepEqual(await readFile(path.join(out, "verify.json")), await readFile(verifyFile));
  assert.deepEqual(
    await readFile(path.join(out, "storybook", "assets", "font.woff2")),
    Buffer.from([0, 255, 1]),
  );

  invoke(...build, "--no-site");

  await Promise.all(
    ["index.html", "verify.json", "usage.json", "storybook", "items"].map(async (file) => {
      await assert.rejects(access(path.join(out, file)), { code: "ENOENT" });
    }),
  );

  assert.match(invoke("registry", "validate", "--registry", location), /Validated 1 items/u);
});

void test("publishes and adopts older revisions from a custom Git registry", async (context) => {
  const { root, project, run } = await fixture();
  context.after(async () => {
    await rm(root, { recursive: true, force: true });
  });

  const catalog = path.join(project, "registry.json");
  const out = path.join(root, "published");

  const writeCatalog = async (content: string) => {
    await writeFile(
      catalog,
      JSON.stringify({
        items: [
          {
            name: "button",
            type: "registry:ui",
            files: [{ path: "button.tsx", target: "@ui/button.tsx", type: "registry:ui", content }],
          },
        ],
      }),
    );
  };

  const git = (...args: string[]) =>
    execFileSync("git", ["-C", project, ...args], { encoding: "utf-8" }).trim();

  git("init", "--quiet");
  await writeCatalog(base);
  git("add", "registry.json");
  git(
    "-c",
    "user.name=Erbium Test",
    "-c",
    "user.email=test@example.com",
    "commit",
    "-qm",
    "Initial registry",
  );
  const initial = git("rev-parse", "HEAD");
  await writeCatalog(base.replace('style = "base"', 'style = "upstream"'));
  git("add", "registry.json");
  git(
    "-c",
    "user.name=Erbium Test",
    "-c",
    "user.email=test@example.com",
    "commit",
    "-qm",
    "Update button",
  );

  const invoke = (...args: string[]) =>
    execFileSync(process.execPath, [bin, ...args, "--cwd", project], { encoding: "utf-8" });

  invoke("registry", "build", "registry.json", "--history", "--out", out);
  const location = path.join(out, "r", "erbium");
  assert.match(invoke("history", "button", "--registry", location), new RegExp(initial, "u"));
  assert.match(
    await readFile(path.join(out, "items", "erbium", "button.html"), "utf-8"),
    /Published revisions/u,
  );
  assert.match(await readFile(path.join(out, "llms.txt"), "utf-8"), /items\/erbium\/button.html/u);

  await writeFile(path.join(project, source), base);
  invoke("adopt", "button", "--at", initial, "--registry", location);
  assert.equal(await readFile(path.join(project, source), "utf-8"), base);
  assert.match(invoke("status", "--registry", location), /update available/u);
  assert.match(run("check"), /provenance: passed/u);

  const indexPath = path.join(location, "index.json");
  const published = await readFile(indexPath, "utf-8");
  await writeCatalog('import { missing } from "./missing";\nexport { missing };');

  const invalid = spawnSync(
    process.execPath,
    [bin, "registry", "build", catalog, "--cwd", project, "--out", out],
    { encoding: "utf-8" },
  );

  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stderr, /Unresolved registry import \.\/missing/u);
  assert.equal(await readFile(indexPath, "utf-8"), published);
});

void test("copies and tracks files without installing dependencies when requested", async (context) => {
  const { root, project, registry, run, fail } = await fixture();
  context.after(async () => {
    await rm(root, { recursive: true, force: true });
  });

  const id = "@erbium/button";

  const item = snapshotFor(id, {
    name: "button",
    type: "registry:ui",
    dependencies: ["missing-test-dependency@1.0.0"],
    files: [{ path: "button.tsx", target: "@ui/button.tsx", type: "registry:ui", content: base }],
  });

  const digest = revision(item);
  await writeFile(path.join(registry, "revisions", `${digest}.json`), JSON.stringify(item));
  await writeFile(
    path.join(registry, "index.json"),
    JSON.stringify({ version: 1, items: { [id]: digest } }),
  );

  const manifest = path.join(project, "package.json");
  const before = await readFile(manifest, "utf-8");
  assert.match(
    run("add", "button", "--skip-install"),
    /Install separately: missing-test-dependency/u,
  );
  assert.equal(await readFile(manifest, "utf-8"), before);
  assert.equal(await readFile(path.join(project, source), "utf-8"), base);
  assert.match(run("check", "--only", "provenance"), /provenance: passed/u);
  assert.notEqual(fail("check", "--only", "dependencies").status, 0);
});

void test("persists a relative registry without replacing shadcn settings", async (context) => {
  const { root, project } = await fixture();
  context.after(async () => {
    await rm(root, { recursive: true, force: true });
  });

  const components = path.join(project, "components.json");
  const original = record(parseJson(await readFile(components, "utf-8")));

  const registries = {
    "@erbium": {
      url: "https://example.test/{name}.json",
      headers: { Authorization: `Bearer \${SHADCN_TOKEN}` },
    },
    "@custom": "https://example.test/custom/{name}.json",
  };

  await writeFile(components, JSON.stringify({ ...original, registries }));

  const invoke = (...args: string[]) =>
    execFileSync(process.execPath, [bin, ...args, "--cwd", project], { encoding: "utf-8" });

  invoke("init", "--registry", "../registry");
  invoke("init");
  assert.deepEqual(parseJson(await readFile(path.join(project, "erbium.config.json"), "utf-8")), {
    registry: "../registry",
  });
  const { registries: updated } = record(parseJson(await readFile(components, "utf-8")));
  assert.deepEqual(
    { ...record(updated), "@erbium-examples": undefined },
    {
      ...registries,
      "@erbium-examples": undefined,
    },
  );
  assert.match(invoke("search", "button"), /@erbium\/button/u);
  assert.match(invoke("docs", "button"), /^# @erbium\/button/u);
  assert.match(invoke("registry", "validate"), /Validated 1 items/u);
  await writeFile(path.join(project, source), "unmanaged");
  invoke("add", "button", "--overwrite");
  assert.equal(await readFile(path.join(project, source), "utf-8"), base);
});

void test("interpolates configured authentication for managed requests and blocks redirects", async (context) => {
  const { root, project, registry } = await fixture();
  const requests: string[] = [];

  const server = createServer((request, response) => {
    const resource = request.url ?? "";
    requests.push(resource);

    if (resource.startsWith("/public/")) {
      assert.equal(request.headers.authorization, undefined);
      assert.equal(request.headers["x-project"], undefined);
    } else if (
      request.headers.authorization !== "Bearer session-value" ||
      request.headers["x-project"] !== "local-value"
    ) {
      response.writeHead(403).end();

      return;
    }

    if (resource.startsWith("/redirect/")) {
      response.writeHead(302, { Location: "/public/index.json" }).end();

      return;
    }

    const file = path.join(registry, resource.replace(/^\/(?:private|public)\//u, ""));
    const stream = createReadStream(file);
    stream.on("error", () => {
      response.writeHead(404).end();
    });
    stream.pipe(response);
  });

  context.after(async () => {
    server.close();
    await rm(root, { recursive: true, force: true });
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  const { port } = Schema.decodeUnknownSync(Schema.Struct({ port: Schema.Number }))(address);

  const url = `http://127.0.0.1:${port}`;
  const args = (...command: string[]) => [bin, ...command, "--cwd", project];
  const env = { ...process.env, ERBIUM_REGISTRY_TOKEN: "", CLI_SMOKE_TOKEN: "session-value" };

  const invoke = async (...command: string[]) => {
    const child = spawn(process.execPath, args(...command), { env });
    const stdout: string[] = [];
    const stderr: string[] = [];
    child.stdout.setEncoding("utf-8").on("data", (chunk: string) => {
      stdout.push(chunk);
    });
    child.stderr.setEncoding("utf-8").on("data", (chunk: string) => {
      stderr.push(chunk);
    });

    await once(child, "close");

    if (child.exitCode !== 0) {
      throw new Error(stderr.join(""));
    }

    return stdout.join("");
  };

  const configure = async (location: string) =>
    await invoke(
      "init",
      "--registry",
      location,
      "--header",
      `Authorization: Bearer \${CLI_SMOKE_TOKEN}`,
      "--header",
      `X-Project: \${CLI_SMOKE_PROJECT}`,
    );

  await configure(`${url}/private`);
  await assert.rejects(invoke("add", "button"), /Set CLI_SMOKE_PROJECT/u);
  assert.deepEqual(requests, []);
  await writeFile(
    path.join(project, ".env"),
    "CLI_SMOKE_PROJECT=base-value\nCLI_SMOKE_TOKEN=base-value\n",
  );
  await writeFile(
    path.join(project, ".env.local"),
    "CLI_SMOKE_PROJECT=local-value\nCLI_SMOKE_TOKEN=local-value\n",
  );
  await invoke("add", "button");
  assert.equal(await readFile(path.join(project, source), "utf-8"), base);
  assert.match(await invoke("search", "button", "--registry", `${url}/public`), /@erbium\/button/u);

  const config = await readFile(path.join(project, "erbium.config.json"), "utf-8");
  const lock = await readFile(path.join(project, ".erbium", "lock.json"), "utf-8");
  assert.match(config, /\$\{CLI_SMOKE_TOKEN\}/u);
  assert.doesNotMatch(config + lock, /session-value|local-value/u);
  await assert.rejects(configure("http://example.test/private"), /require HTTPS/u);
  await assert.rejects(
    invoke("init", "--registry", `${url}/private`, "--header", "Authorization: literal-value"),
    /placeholder/u,
  );
  assert.equal(await readFile(path.join(project, "erbium.config.json"), "utf-8"), config);

  await configure(`${url}/redirect`);
  const count = requests.length;
  await assert.rejects(invoke("search"), /fetch failed/u);
  assert.deepEqual(requests.slice(count), ["/redirect/index.json"]);
  assert.match(await invoke("check"), /provenance: passed/u);
});
