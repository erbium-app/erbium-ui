---
title: "Account Settings"
description: "A profile and settings page whose sections load independently and reveal in place."
---

## Usage

Install the example with `npx shadcn@latest add @erbium-examples/account-settings-overview` and adapt it to your data. It composes [Avatar](/docs/components/avatar), [Badge](/docs/components/badge), [Card](/docs/components/card), [Form](/docs/components/form), [Select](/docs/components/select), [Switch](/docs/components/switch) and [Item](/docs/components/item).

## Loading

Each section comes from its own request and owns its own [Skeleton](/docs/components/skeleton), so a slow request holds back only its section. Every skeleton is measured from a sample of that section's data:

- The profile header draws its avatar, name, badge and button at their real size.
- The preferences form draws its fields and switches as blocks and its labels as bars. It mounts with the loaded values, so an empty form never flashes first.
- The sessions list draws a row per sample session.

Card titles and descriptions are known before any data arrives, so they render at once and only the data inside each card waits.

A request that fails shows its error in its own section while the others stay usable.
