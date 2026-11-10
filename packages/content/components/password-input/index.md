---
title: "Password Input"
description: "A password field with a built-in show and hide toggle."
---

## Usage

Use `PasswordInput` for every password, passphrase, or secret a person types. It is an [Input Group](/docs/components/input-group) with the input and an eye toggle already in place, so do not build the toggle yourself from `Input type="password"`.

**Import:** `@erbium/ui/components/password-input`

```tsx
import { Field, FieldLabel } from "@erbium/ui/components/field";
import { PasswordInput } from "@erbium/ui/components/password-input";

<Field>
  <FieldLabel>Password</FieldLabel>
  <PasswordInput />
</Field>;
```

Props other than the visibility props go to the `<input>`. `groupClassName` styles the frame and `groupRef` reaches it. `toggleLabel` renames the toggle.

## Autocomplete

The input defaults to `autoComplete="current-password"`, which tells password managers to fill a saved password. Pass `autoComplete="new-password"` on sign-up and password-change forms so they offer to generate one instead. Autocapitalization and spellcheck are off, so the text stays out of spell checkers and mobile keyboards do not change it.

## Visibility

The password is hidden by default. Pass `defaultVisible` to start shown, or `visible` with `onVisibleChange` to control it, for example to show a password and its confirmation together. `onVisibleChange` receives the next value and a `reason`: `toggle`, `submit`, or `reset`.

Submitting or resetting the surrounding form hides the password again, so a revealed password is not left as plain text on the page or offered to the browser as one.

## Accessibility

- The input is named by its `FieldLabel` and works with `Field` like any other input: description, error, and validity states are wired up.
- The toggle is a button named "Show password" with `aria-pressed` and `aria-controls` pointing at the input. The name stays the same in both states; `aria-pressed` says whether the password shows. The eye icon is decorative.
- A pointer press on the toggle keeps focus, caret, and selection in the input. A keyboard press (Enter or Space) leaves focus on the toggle, which stays in the tab order.
- `disabled`, on the component or on the surrounding `Field`, disables the input and the toggle. A `readOnly` input can still be shown.
- Edge's built-in reveal button is hidden, so only one toggle shows.

## Composition

`PasswordInput` covers most layouts. Compose the parts to add addons around the input:

```text
PasswordInputRoot          (InputGroup with the visibility state)
├── PasswordInputControl   (the <input>)
├── InputGroupAddon
└── InputGroupAddon align="inline-end"
    └── PasswordInputToggle
        └── PasswordInputIndicator (default children)
```

`PasswordInputRoot` takes `visible`, `defaultVisible`, `onVisibleChange`, `disabled`, and the `InputGroup` props. As with any input group, place addons after the control in the DOM and use `align` to position them.

## Forms

In a TanStack Form, use `field.PasswordField` from the [Form](/docs/components/form) module. It renders the label, `PasswordInput`, description, and error, and binds the value, change, and blur handlers. Because a pointer press on the toggle keeps focus in the input, showing the password does not mark the field touched or reveal its errors early. A rejected submit shakes the whole input group.

```tsx
<form.AppField name="password">
  {(field) => (
    <field.PasswordField
      label="Password"
      autoComplete="new-password"
      description="At least 8 characters."
    />
  )}
</form.AppField>
```

Validate with an Effect Schema. Check a confirmation field with a `Schema.makeFilter` on the struct and give its issue `path: ["confirmPassword"]` so the message shows under the confirmation.
