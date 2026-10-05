// Tailwind scans these literal recipes for static Astro and generated Markdown.
export const proseStyles = [
  "markdown-copy [&_hr]:carve-rule [&_hr]:h-[2px] [&_hr]:border-0 [&_hr]:my-8",
  "text-muted-foreground text-base leading-[1.625] [min-inline-size:0] [&_:is(p,_li,_blockquote,_td,_th)]:[text-wrap-style:auto]",
  "[&.variant-description_:is(p,_li)]:[text-wrap-style:pretty] [&_>_p]:[max-inline-size:70ch] [&_>_ul]:[max-inline-size:70ch] [&_>_ol]:[max-inline-size:70ch] [&_p]:m-[1.5rem_0_0]",
  "[&_blockquote]:m-[1.5rem_0] [&_blockquote]:ps-5 [&_blockquote]:[border-inline-start:3px_solid_var(--border)] [&_blockquote]:text-foreground [&_blockquote_>_:first-child]:mt-0",
  "[&_blockquote_p_+_p]:mt-3 [&_blockquote_p_+_p]:text-muted-foreground [&_blockquote_p_+_p]:text-sm [&_>_:first-child]:mt-0 [&_h2_+_p]:mt-4",
  "[&_h2]:text-foreground [&_h2]:font-semibold [&_h2]:leading-[1.3333] [&_h2]:tracking-[normal] [&_h2]:scroll-mt-8",
  "[&_h2]:text-2xl [&_h2]:m-[3rem_0_0] [&_h3]:text-foreground [&_h3]:font-semibold [&_h3]:leading-[1.5556]",
  "[&_h3]:tracking-[normal] [&_h3]:scroll-mt-8 [&_h3]:text-lg [&_h3]:m-[2rem_0_0] [&_ul]:ps-[1.4rem]",
  "[&_ul]:[list-style:revert] [&_ul]:my-6 [&_ol]:ps-[1.4rem] [&_ol]:[list-style:revert] [&_ol]:my-6",
  "[&_li]:ps-[0.2rem] [&_li]:my-2 [&_li::marker]:text-muted-foreground [&_a]:text-link [&_a]:font-medium",
  "[&_a]:underline [&_a]:[text-underline-offset:0.2em] [&_a]:[text-decoration-thickness:from-font] [&_a]:[text-underline-position:from-font] [&_strong]:text-foreground",
  "[&_strong]:font-semibold [&_a_:is(strong,_b)]:text-inherit min-[1024px]:[&_h2]:mt-16 [&_code]:font-mono [&_code]:[font-size:0.8em]",
  "[&_:not(pre)_>_code]:surface-frame [&_:not(pre)_>_code]:p-[0.15rem_0.3rem] [&_:not(pre)_>_code]:border [&_:not(pre)_>_code]:border-transparent [&_:not(pre)_>_code]:rounded-sm",
  "[&_:not(pre)_>_code]:wrap-anywhere [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:border-collapse",
  "[&_table]:my-6 [&_table]:[font-size:0.8rem] [&_th]:carve-bottom [&_th]:p-[0.6rem_0.8rem] [&_th]:text-start",
  "[&_th]:align-top [&_th]:font-semibold [&_td]:carve-bottom [&_td]:p-[0.6rem_0.8rem] [&_td]:text-start",
  "[&_td]:align-top [&_.docs-code-block]:my-4",
].join(" ");

export const codeBlockStyles = [
  "docs-code-block surface-field [--surface-face:var(--surface-canvas)] block relative",
  "min-w-0 overflow-hidden border border-transparent rounded-lg",
  "[&_pre]:bg-surface-canvas [&_pre]:max-h-136 [&_pre]:m-0 [&_pre]:p-5 [&_pre]:pe-12",
  "[&_pre]:text-[0.75rem] [&_pre]:leading-[1.8] [&_pre]:font-mono [&_pre]:overflow-auto [&_pre_code]:[font-family:inherit]",
].join(" ");
