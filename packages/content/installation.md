---
title: Installation
description: Install Erbium UI with shadcn and manage component updates with the Erbium CLI.
---

Add Erbium components to your React application with the [Shadcn CLI](https://ui.shadcn.com/docs/cli). It copies the source into your project and installs the dependencies. Import from those local files and edit them as needed. You do not need to clone this repository or install an `@erbium/ui` package.

## Prerequisites

Use a React project with TypeScript and [Tailwind CSS v4](https://tailwindcss.com/docs/installation). The CLI needs a `components.json` file and configured import aliases. If your app already has Shadcn configured, skip to **Configure the registries**.

Run all commands below in your application directory. The examples use Bun; `npx` can replace `bunx`.

## Set up your application

For a new Vite application:

Run the creation command from the parent directory:

```sh
bunx shadcn@latest init --template vite --base base --preset nova --no-monorepo --name my-app --yes
cd my-app
```

The CLI creates the app, configures Tailwind and the `@/` import alias, and writes `components.json`.

For an existing React application, follow the [Shadcn setup for your framework](https://ui.shadcn.com/docs/installation), then initialize it from its root:

```sh
bunx shadcn@latest init
```

Choose Base UI during setup. Continue below once `components.json`, Tailwind v4, and your aliases are configured. File paths in this guide use the default Vite layout; use your framework’s global CSS entry and configured aliases elsewhere.

## Configure the registries

Add these entries to the `registries` object in your project’s `components.json`. Keep the rest of the generated configuration.

```json
{
  "registries": {
    "@erbium": "https://ui.erbium.app/r/ui/{name}.json",
    "@erbium-examples": "https://ui.erbium.app/r/examples/{name}.json"
  }
}
```

`@erbium` contains components, hooks, providers, and styles. `@erbium-examples` contains compositions and portable Storybook stories. The CLI resolves their dependencies and uses your [configured aliases](https://ui.shadcn.com/docs/components-json).

## Install styles and a component

```sh
bunx shadcn@latest add @erbium/styles @erbium/button --yes --overwrite
```

This replaces the starter’s Shadcn Button with Erbium’s version. In an existing project, omit `--overwrite` and review any file conflicts before replacing your own components.

The installation adds shared CSS to `src/styles/`, the Button to `src/components/ui/button.tsx`, and its helpers and npm dependencies. Erbium’s class merger is installed separately as `src/lib/erbium-utils.ts`.

## Load the styles

For the new Vite app, replace the generated contents of `src/index.css` with:

```css
@import "./styles/globals.css";
```

Keep `import "./index.css"` in `src/main.tsx`. The shared stylesheet includes Tailwind, fonts, semantic tokens, surfaces, motion, and utilities. Add your own CSS after the import.

In another framework, load the installed `src/styles/globals.css` from its global CSS entry, using the appropriate relative path. Keep one global Tailwind/theme entry; avoid retaining the starter’s conflicting theme definitions. The CLI copies the styles but does not wire this import for you.

## Mount the icon sprite

Components draw their icons from one shared sprite. Mount `IconSprite` once in your application shell, outside scrolling and hidden panels:

```tsx
import { IconSprite } from "@/components/ui/icon-sprite";

createRoot(document.getElementById("root")!).render(
  <>
    <IconSprite />
    <App />
  </>,
);
```

It renders the generated `@erbium/icons` symbols inline, so icons inherit the surrounding text color and need no network request. Until it is mounted, icons render empty.

### Serve the sprite as a file

Inlining adds the whole sprite to every server-rendered page. If your app serves files from its own origin, it can reference `@erbium/icons/sprite.svg` instead, so the browser downloads it once and caches it. Wrap the app in `IconSpriteProvider` with the file's URL and skip `IconSprite`:

```tsx
import spriteUrl from "@erbium/icons/sprite.svg?url";
import { IconSpriteProvider } from "@/components/ui/icon";

createRoot(document.getElementById("root")!).render(
  <IconSpriteProvider href={spriteUrl}>
    <App />
  </IconSpriteProvider>,
);
```

The URL must be same-origin, because browsers do not load `<use>` references from other origins. Icons still inherit the surrounding text color. Do not add a `<link rel="preload">` for the file: browsers fetch `<use>` references separately, so a preload downloads the sprite twice.

## Use the component

Replace `src/App.tsx` with:

```tsx
import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <main className="min-h-screen p-8">
      <Button>Continue</Button>
    </main>
  );
}
```

```sh
bun run dev
```

Run `bun run build` to check the production build. Continue with [Using components](/docs/getting-started) for examples, providers, themes, and stories.

## Recommended tooling

These tools are optional development dependencies in your application.

### Linting and formatting

We recommend [Oxlint](https://oxc.rs/docs/guide/usage/oxlint) and [Oxfmt](https://oxc.rs/docs/guide/usage/oxfmt), configured through [Ultracite](https://ultracite.ai/). Add the [Shadcn linter](https://github.com/shadcn-ui/lint) for rules that check component usage and design tokens.

```sh
bunx ultracite@latest init --pm bun --linter oxlint --frameworks react --js-plugins @shadcn/lint
```

The setup installs the tools and writes their configuration. Choose your editor and coding agent integrations when prompted. If your app already has a linting setup, review and migrate its configuration rather than keeping competing lint and format commands.

```sh
bunx ultracite check
bunx ultracite fix
```

Keep your framework’s TypeScript check and production build alongside linting. For the Vite app above, run `bun run build`.

### Project skills

We recommend [skills.sh](https://skills.sh/) to find and manage coding agent skills. Run its [CLI](https://skills.sh/docs/cli) from your application root and choose the agents you use. Install skills at project scope so their guidance travels with the project.

Choose the skills that match your work:

- [Jakub Krehel](https://jakub.kr/), founding design engineer at [Interfere](https://interfere.com/): [Better typography](https://skills.sh/jakubkrehel/skills/better-typography), [Better accessibility](https://skills.sh/jakubkrehel/skills/better-accessibility), [Better layout](https://skills.sh/jakubkrehel/skills/better-layout), [Better writing](https://skills.sh/jakubkrehel/skills/better-writing), and [Better colors](https://skills.sh/jakubkrehel/skills/better-colors) cover readability, interaction, layout, copy, and color.
- [Emil Kowalski](https://emilkowal.ski/), design engineer at [Linear](https://linear.app/): [Animate](https://skills.sh/emilkowalski/skill/animate) and [Review animations](https://skills.sh/emilkowalski/skill/review-animations) guide motion implementation and review.
- [Vercel](https://vercel.com/): [Building components](https://skills.sh/vercel/components.build/building-components), based on the [specification co-authored by Hayden Bleasel and Shadcn](https://components.build/), covers accessible component APIs. [React composition patterns](https://skills.sh/vercel-labs/agent-skills/vercel-composition-patterns) covers reusable React compositions.

```sh
bunx skills add jakubkrehel/skills --skill better-typography better-accessibility better-layout better-writing better-colors
bunx skills add emilkowalski/skill --skill animate review-animations
bunx skills add vercel/components.build --skill building-components
bunx skills add vercel-labs/agent-skills --skill vercel-composition-patterns
```

List installed skills and update the project’s skills with:

```sh
bunx skills list
bunx skills update --project
```

### Skills shipped with dependencies

[TanStack Intent](https://tanstack.com/intent/latest/docs/overview) discovers skills shipped inside installed npm packages. Their guidance follows the installed library version. Intent configures your agent to discover and load that guidance; it does not install the libraries themselves.

After installing the packages your app needs, set up Intent from your project root:

```sh
bun add -d @tanstack/intent
bunx intent install
bunx intent list
```

[TanStack Table](https://tanstack.com/table/latest/docs/agent-skills) ships skills for React setup, table state, filtering, sorting, pagination, and composition with Query and Virtual. For a React table, load its setup guidance with:

```sh
bunx intent load @tanstack/react-table#getting-started
```

For keyboard interactions, refer to [TanStack Hotkeys](https://tanstack.com/hotkeys/latest/docs/overview). Check `intent list` for skills available in your installed release and use the package and skill names it reports. The Hotkeys version currently used by Erbium does not bundle skills, so use its documentation when none are listed. Other dependencies, including Ultracite and TanStack Charts, can also expose packaged skills through Intent.

Give your agent [llms.txt](/llms.txt) to discover Erbium’s documentation. Each documentation page is also available as Markdown by appending `.md` to its URL. Install [examples and stories](/docs/getting-started) alongside components when the agent needs composition and usage guidance.

See [Typography](/docs/foundations/typography) for font roles, reading, and multilingual usage.

## Track and update components

Use the Erbium CLI from a project with `components.json` and TypeScript path aliases. Select the Erbium package explicitly when running the command.

```sh
bunx --package @erbium/cli erbium add styles button
```

If you already installed those items with shadcn, use `adopt styles button` instead. Adoption checks that the files match the current registry revision before it records them. It leaves the source files as they are.

Commit `.erbium/lock.json` and `.erbium/bases/` with your source. The lock records the registry revision for each item and the hash of each installed file. The baseline files let Erbium compare upstream updates against exactly what landed in your project, even after you edit the files.

```sh
bunx --package @erbium/cli erbium status
bunx --package @erbium/cli erbium diff button
bunx --package @erbium/cli erbium diff button --local
bunx --package @erbium/cli erbium update --dry-run
bunx --package @erbium/cli erbium update
bunx --package @erbium/cli erbium check
```

Updates use Git to merge your edits and the registry's changes from the same baseline. If both sides changed the same lines, Erbium reports the conflict before writing source files. If a revision stops shipping a file, Erbium reports the path and leaves the file in your project. `check` runs offline and reports missing files, damaged baselines, unresolved conflict markers, and missing package declarations. Continue running your project's own lint, type checks, and build.
