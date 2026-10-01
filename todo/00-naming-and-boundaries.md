# 00 — Naming and boundaries

Erbium is an opinionated composition of Base UI behavior, shadcn UI conventions, and useful Coss UI concepts. It should have one clear public name for each concept.

## Naming decisions

- Keep familiar shadcn names for shared concepts: `input-otp`, `hover-card`, `navigation-menu`, `radio-group`, and the existing menu variants.
- Use a Coss name only when it represents a distinct reusable primitive. Do not add aliases solely for parity with another library's inventory.
- Keep `FieldSet` with the `field` components unless independent installation or behavior gives a separate registry item a clear purpose.
- Keep form state in the application. `Field` provides layout and accessible control association; it is not a second form state system.
- Treat a date picker as a composition of `calendar` and input or popup primitives. Keep calendar behavior in one place.
- Use kebab-case filenames, PascalCase exports, and stable `data-slot` names.

## Package boundary

`packages/ui` owns reusable controls and presentation. Product workflows, fetching, persistence, and domain state belong in apps, blocks, or dedicated packages. Review feature-heavy components against this boundary when changing them; do not rename or relocate them for inventory parity alone.
