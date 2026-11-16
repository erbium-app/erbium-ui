# 01 — Component additions

Reviewed 2026-11-17.

## Planned additions

- [ ] TerminalCommand (working name): shell and CLI snippets for Bash, Zsh, PowerShell, and other terminal contexts; optional package-manager or platform selection, prompt presentation, and shared CopyButton. Copy the selected executable command without decorative prompts. Compose CodeBlock where useful. This is separate from the existing Command palette.

Changed-file review, review comments, tool output, and agent session compositions are tracked in [11](./11-files-and-session-ui.md). Platform libraries and agent integrations are tracked in [09](./09-agent-tooling-and-platforms.md).

## Candidates, not commitments

- `menu`: add only if existing dropdown, context-menu, and menubar compositions cannot express the needed behavior.
- `frame`: add only if Card and surface utilities cannot express a recurring layout.
- `group`: add only if ButtonGroup, InputGroup, and Toolbar leave a concrete gap.

Every addition needs source, documentation, useful stories, registry metadata, and the relevant checks in [04](./04-validation.md).
