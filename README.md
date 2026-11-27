<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="apps/docs/public/brand/erbium-logo-dark.svg">
    <img src="apps/docs/public/brand/erbium-logo-light.svg" alt="Erbium" width="64" height="64">
  </picture>
</p>

<h1 align="center">Erbium UI</h1>

<p align="center">An agent-ready design system with taste built in.</p>

<p align="center">
  <a href="https://ui.erbium.app">Docs</a> ·
  <a href="https://ui.erbium.app/docs/installation">Install</a> ·
  <a href="https://ui.erbium.app/docs/roadmap">Roadmap</a> ·
  <a href="./LICENSE">MIT License</a>
</p>

Erbium UI is the open-source component library and design system behind [Erbium](https://erbium.app). Copy styled components and blocks into your project and own the source, or build your own interfaces with [`@erbium-ui/react`](packages/react), Erbium's unstyled primitives.

- **Built on Base UI**, with shadcn/ui registry conventions. Accessible, RTL-ready, and reduced-motion aware.
- **Own the source.** Install with shadcn or the Erbium CLI, then track and merge upstream changes with `erbium status`, `diff`, and `update`.
- **Opinionated defaults.** Loading, error, and empty states, motion, and depth tokens are designed in, not left to each screen.
- **Ready for agents.** Every docs page has a Markdown version, plus `llms.txt` and a JSON API. Includes building blocks for agentic interfaces: streaming Markdown responses, messages, questionnaires, code blocks, diffs, file trees, steppers, and matrix loaders.

## Development

Requires [Vite+](https://viteplus.dev). With its managed environment on (`vp env on`), `vp` uses the Node.js and Bun versions this repository pins.

```bash
vp install
vp run dev    # website, Storybook, and docs
vp run ready  # check and build
```

| Path               | Purpose                                     |
| ------------------ | ------------------------------------------- |
| `packages/ui`      | Styled components, styles, and the registry |
| `packages/react`   | `@erbium-ui/react` headless primitives      |
| `packages/content` | Shared Markdown docs                        |
| `apps/docs`        | Documentation site                          |
| `apps/storybook`   | Component workbench                         |

Contributor conventions are in [AGENTS.md](./AGENTS.md).

## License

[MIT](./LICENSE) © 2026 AvanVision Pty Ltd
