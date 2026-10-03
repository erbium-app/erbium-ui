---
title: "Csp Provider"
description: "Applies your content security policy to UI output."
---

## Usage

Configures inline style and script tags rendered by Base UI components. Import from `@erbium/ui/components/csp-provider`.

Wrap your application with `<CSPProvider nonce={nonceFromServer}>` when your CSP requires a nonce. Generate a fresh nonce on the server for each response and include the same value in the CSP header. The provider does not configure the header or authorize inline style attributes.

Alternatively, use `disableStyleElements` with Erbium's global stylesheet, which includes Base UI's scrollbar-hiding rules. Storybook and the docs previews use this configuration. This option does not disable inline scripts; opt-in scripts still require a nonce under a strict CSP.

See [Base UI CSP Provider](https://base-ui.com/react/utils/csp-provider) for server configuration and limitations.
