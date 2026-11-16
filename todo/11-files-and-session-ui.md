# 11 — Files, review, and session UI

Use OpenCode's session UI and Pierre's rendering capabilities as references. Prefer compositions of existing blocks; applications own loading, execution, and persistence.

## Current status (2026-11-17)

The single-file blocks exist in `packages/ui/src/blocks`: FileTree (Git status and path updates), FileView, and DiffView (patch strings, split/unified layouts, wrapping, added/deleted/renamed/empty states, line selection, and typed annotations through Pierre's slots). Message, Bubble, MessageScroller, and Attachment cover the basic chat parts. Nothing below combines them yet.

## 1. Changed-file review

- [ ] Compose FileTree, DiffView, and FileView with controlled file selection, rename paths, and added/deleted counts.
- [ ] Add source/diff switching and next/previous file navigation.
- [ ] Cover loading, error, no changes, no Git, and unsupported files in the composed review.

## 2. Review comments

- [ ] Add reusable comment thread and editor components for the existing annotation slots.
- [ ] Define controlled IDs, file paths, side-aware line ranges, and create/update/delete callbacks; consider resolve/reopen.
- [ ] Support gutter and selected-line comments, drafts, cancellation, and focus restoration without intercepting editor keys.

## 3. Multi-file review

- [ ] Add collapsible file sections, expand/collapse controls, and controlled reviewed state.
- [ ] Evaluate Pierre MultiFileDiff, Virtualizer, shared workers, and SSR preloading against the installed version.
- [ ] Verify large reviews, wrapping, context expansion, and stable selection/comment anchors.
- [ ] Evaluate conflict rendering when a consumer needs it.

## 4. Tool output

- [ ] Compose expandable tool entries with pending/running/completed/failed states, summaries, duration, and actions.
- [ ] Reuse code, file, and diff blocks for output; cover streaming, cancellation, errors, and grouped calls.
- [ ] Defer heavy output until opened where useful.

## 5. Messages and composer

- [ ] Add Markdown, tool groups, and streaming states to the existing Message compositions.
- [ ] Define controlled composer text, attachments, submit, pending, and cancel behavior.
- [ ] Build a full session showcase before deciding whether a dedicated session package is needed.

## Design and validation

Keep APIs minimal and reuse shared surfaces, input styles, and sidebar sizing. Validate keyboard access, RTL, light/dark, text zoom, touch sizing, and large content. Keep Pierre virtualization measurements aligned with rendered rows.

Include documentation and useful stories, regenerate affected registries, run `bunx vp check` on edited files, and verify interactions manually.

## References

- OpenCode checkout: `/Volumes/AlirezaDev/Codes/Chat/opencode`. Review `packages/session-ui/src/components/session-review.tsx`, `line-comment-annotations.tsx`, `message-part.tsx`, and `v2/components/session-review-v2.tsx`.
- Pierre checkout: `/Volumes/AlirezaDev/Codes/Chat/pierre`. Review `packages/diffs/src/react` and `packages/trees/src`.

OpenCode supplies session workflow examples; Pierre supplies file/diff/tree rendering. Comments, review progress, tool state, and message composition remain application or Erbium concerns. Check dependency versions and licenses before adopting more capabilities.
