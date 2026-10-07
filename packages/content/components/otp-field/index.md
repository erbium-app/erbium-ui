---
title: "OTP Field"
description: "Enter and verify a one-time code."
---

## Usage

Accessible one-time password field built on Base UI's [OTP Field](https://base-ui.com/react/components/otp-field), with `status` for loading, success and error.

**Import:** `@erbium/ui/components/otp-field`

## Usage

```tsx
import { OTPField } from "@erbium/ui/components/otp-field";

<OTPField aria-label="One-time password" length={6} groups={[3, 3]} status="idle" />;
```

## Composition

Without children the field renders `length` inputs. Pass children to compose them yourself:

```text
OTPField
├── OTPFieldGroup
│   └── OTPFieldInput (×n)
├── OTPFieldSeparator
└── OTPFieldGroup
```

Slots after the first need an `aria-label` such as `Character 2 of 6` when composed by hand.
