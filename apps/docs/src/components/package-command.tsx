import { useSyncExternalStore } from "react";
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockIcon,
  CodeBlockPanel,
  CodeBlockTabs,
} from "@erbium/ui/blocks/code-block";

const managers = [
  { label: "Bun", value: "bun" },
  { label: "npm", value: "npm" },
  { label: "pnpm", value: "pnpm" },
  { label: "Yarn", value: "yarn" },
] as const;

type Manager = (typeof managers)[number]["value"];

interface Runner {
  add: string;
  addDev: string;
  install: string;
  run: string;
  /** Runs a package fetched from the registry. */
  dlx: string;
  /** Runs a binary the project already installed. */
  exec: string;
  /** Runs a binary from a package that is not the binary's own name. */
  dlxPackage: (pkg: string) => string;
}

const runners: Record<Manager, Runner> = {
  bun: {
    add: "bun add",
    addDev: "bun add -d",
    dlx: "bunx",
    dlxPackage: (pkg) => `bunx --package ${pkg}`,
    exec: "bunx",
    install: "bun install",
    run: "bun run",
  },
  npm: {
    add: "npm install",
    addDev: "npm install -D",
    dlx: "npx",
    dlxPackage: (pkg) => `npx --package ${pkg}`,
    exec: "npx",
    install: "npm install",
    run: "npm run",
  },
  pnpm: {
    add: "pnpm add",
    addDev: "pnpm add -D",
    dlx: "pnpm dlx",
    dlxPackage: (pkg) => `pnpm --package=${pkg} dlx`,
    exec: "pnpm exec",
    install: "pnpm install",
    run: "pnpm run",
  },
  yarn: {
    add: "yarn add",
    addDev: "yarn add -D",
    dlx: "yarn dlx",
    dlxPackage: (pkg) => `yarn dlx -p ${pkg}`,
    exec: "yarn",
    install: "yarn install",
    run: "yarn run",
  },
};

// A package named with a version (`shadcn@latest`) is fetched from the registry;
// a bare name (`erbium`) is a binary the project installed earlier.
const isRemote = (pkg: string) => pkg.lastIndexOf("@") > 0;

const translateLine = (line: string, runner: Runner, manager: Manager) => {
  const packageRun = /^bunx --package (?<pkg>\S+) (?<rest>.*)$/u.exec(line)?.groups;

  if (packageRun) {
    return `${runner.dlxPackage(packageRun.pkg)} ${packageRun.rest}`;
  }

  const bunx = /^bunx (?<pkg>\S+)(?<rest>.*)$/u.exec(line)?.groups;

  if (bunx) {
    const { pkg, rest } = bunx;

    return `${isRemote(pkg) ? runner.dlx : runner.exec} ${pkg}${rest.replace(/--pm bun\b/u, `--pm ${manager}`)}`;
  }

  const rules: [RegExp, string][] = [
    [/^bun add (?:-d|-D|--dev)\b/u, runner.addDev],
    [/^bun add\b/u, runner.add],
    [/^bun install\b/u, runner.install],
    [/^bun run\b/u, runner.run],
  ];

  for (const [pattern, replacement] of rules) {
    if (pattern.test(line)) {
      return line.replace(pattern, replacement);
    }
  }

  return line;
};

/** Translates a block written with Bun into each package manager, or returns no items when it runs none. */
export const packageCommands = (code: string) => {
  const lines = code.split("\n");

  if (!lines.some((line) => /^(?:bunx|bun (?:add|install|run))\b/u.test(line))) {
    return [];
  }

  return managers.map(({ label, value }) => ({
    code: lines.map((line) => translateLine(line, runners[value], value)).join("\n"),
    label,
    language: "shell",
    value,
  }));
};

const storageKey = "erbium-package-manager";
const listeners = new Set<() => void>();
let selected: Manager | undefined;

const isManager = (value: string | null): value is Manager =>
  managers.some((manager) => manager.value === value);

const readManager = (): Manager => {
  if (selected === undefined) {
    try {
      const stored = localStorage.getItem(storageKey);
      selected = isManager(stored) ? stored : "bun";
    } catch {
      selected = "bun";
    }
  }

  return selected;
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const selectManager = (value: string) => {
  if (!isManager(value)) {
    return;
  }

  selected = value;

  try {
    localStorage.setItem(storageKey, value);
  } catch {
    /* Keep the choice for this visit. */
  }

  for (const listener of listeners) {
    listener();
  }
};

/** A command block whose package-manager tabs follow one choice shared across the docs. */
export const PackageCommand = ({ code, className }: { code: string; className?: string }) => {
  const manager = useSyncExternalStore(subscribe, readManager, () => "bun" as const);
  const items = packageCommands(code);

  if (items.length === 0) {
    return <CodeBlock wrap code={code} language="shell" surface="command" className={className} />;
  }

  return (
    <CodeBlock
      wrap
      surface="command"
      items={items}
      value={manager}
      onValueChange={selectManager}
      className={className}
    >
      <CodeBlockHeader>
        <div className="flex min-w-0 items-center gap-related">
          <CodeBlockIcon className="shrink-0 text-muted-foreground" />
          <CodeBlockTabs aria-label="Package manager" />
        </div>
      </CodeBlockHeader>
      <CodeBlockActions>
        <CodeBlockCopyButton />
      </CodeBlockActions>
      {items.map((item) => (
        <CodeBlockPanel key={item.value} value={item.value} />
      ))}
    </CodeBlock>
  );
};
