---
title: "As Link"
story: AsLink
---

You can use the `buttonVariants` helper to make a link look like a button.

**Do not use `<Button render={<a />} nativeButton={false} />` for links.** The Base UI `Button` component always applies `role="button"`, which overrides the semantic link role on `<a>` elements. Use `buttonVariants` with a plain `<a>` tag instead.
