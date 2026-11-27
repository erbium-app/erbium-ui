# @erbium-ui/react

Unstyled, accessible React primitives for components that hold real behavior: cascading selects, filter builders, inline editing, pagination, QR codes, segmented controls, sliders, multi-step flows and streamed replies. Each primitive is a set of parts in the style of [Base UI](https://base-ui.com): you render the parts, style them with `className`, and read their state from `data-*` attributes.

Erbium UI's styled components are built on these primitives. Use this package directly when you want the behavior with your own design.

## Install

```sh
npm install @erbium-ui/react @base-ui/react
```

React 19 and `@base-ui/react` 1.9 or later are peer dependencies.

## Entry points

| Import                                     | Contents                                          | Runs on                                                   |
| ------------------------------------------ | ------------------------------------------------- | --------------------------------------------------------- |
| `@erbium-ui/react/cascader`                | `Cascader` parts                                  | Client                                                    |
| `@erbium-ui/react/filters`                 | Filters parts, adapters and utilities             | Utilities on server or client. Parts and hooks on client. |
| `@erbium-ui/react/editable`                | `Editable` parts                                  | Client                                                    |
| `@erbium-ui/react/pagination`              | `Pagination` parts, `usePagination`, and the core | Client                                                    |
| `@erbium-ui/react/pagination/core`         | `getPagination` page layout                       | Server or client                                          |
| `@erbium-ui/react/qr-code`                 | `QRCode` parts, `useQRCode`, and the core         | Client                                                    |
| `@erbium-ui/react/qr-code/core`            | QR encoding and SVG paths                         | Server or client                                          |
| `@erbium-ui/react/segmented-control`       | `SegmentedControl.Indicator` and the core         | Client                                                    |
| `@erbium-ui/react/segmented-control/core`  | Measuring math for the indicator                  | Server or client                                          |
| `@erbium-ui/react/slider`                  | `Slider` parts, `useSlider`, and the core         | Client                                                    |
| `@erbium-ui/react/slider/core`             | Scales, steps and marks                           | Server or client                                          |
| `@erbium-ui/react/stepper`                 | `Stepper` parts, hooks, TanStack Form adapter     | Client                                                    |
| `@erbium-ui/react/stepper/core`            | The flow's pure state machine                     | Server or client                                          |
| `@erbium-ui/react/streaming-response`      | `useTextStream` and the core                      | Client                                                    |
| `@erbium-ui/react/streaming-response/core` | Statuses and stream reading                       | Server or client                                          |

Client entries start with `"use client"`, so React Server Components frameworks such as the Next.js App Router can render their parts from a server component. Entries marked server or client are plain functions and import nothing from React.

## Cascader

A select whose options form a tree. One popup shows one level at a time; a branch opens its level in place, and search finds options at any depth below the open level.

```tsx
import { Cascader } from "@erbium-ui/react/cascader";

const places = [
  {
    value: "europe",
    label: "Europe",
    children: [
      { value: "berlin", label: "Berlin" },
      { value: "paris", label: "Paris" },
    ],
  },
];

export const PlacePicker = () => (
  <Cascader.Root items={places} searchable name="place">
    <Cascader.Trigger>
      <Cascader.Value placeholder="Pick a place" />
    </Cascader.Trigger>
    <Cascader.Portal>
      <Cascader.Positioner>
        <Cascader.Popup>
          <Cascader.Back />
          <Cascader.Search />
          <Cascader.Empty>No results</Cascader.Empty>
          <Cascader.List>
            <Cascader.Level>
              <Cascader.Rows>
                {(row) => (
                  <Cascader.Item row={row}>
                    <Cascader.ItemIndicator />
                    {row.node.label}
                    <Cascader.ItemTrail />
                    <Cascader.ItemCount />
                  </Cascader.Item>
                )}
              </Cascader.Rows>
            </Cascader.Level>
          </Cascader.List>
        </Cascader.Popup>
      </Cascader.Positioner>
    </Cascader.Portal>
  </Cascader.Root>
);
```

Pass `multiple` to pick any number of leaves. Node `data` carries whatever your design renders with a node, such as an icon or a description, and is typed through `Cascader.Rows`.

The full API reference, keyboard map and data attributes are on the [documentation site](https://ui.erbium.app/docs/react).

## Filters

A filter builder for lists and tables. Rules are plain JSON in the same shape as TanStack Table's column filters, so they can live in a table, in the URL or on a server.

```tsx
import { Filters, useListFilters } from "@erbium-ui/react/filters";

const fields = {
  title: { type: "text", label: "Title", value: (task: Task) => task.title },
  estimate: { type: "number", label: "Estimate", value: (task: Task) => task.estimate },
};

export const TaskList = ({ tasks }: { tasks: Task[] }) => {
  const { filters, items } = useListFilters({ items: tasks, fields });

  return (
    <Filters.Root filters={filters}>
      {filters.active.map((field) => (
        <Filters.Field key={field.id} id={field.id}>
          <Filters.Value />
          <Filters.Remove>×</Filters.Remove>
        </Filters.Field>
      ))}
      <Filters.Clear>Clear</Filters.Clear>
      <TaskTable tasks={items} />
    </Filters.Root>
  );
};
```

`useTableFilters(table)` reads a TanStack table instead, and `useFilterSearch` keeps the rules in the URL. `useFieldPicker` and `useOptionPicker` return props for a multiple `Cascader.Root`, which adds filters and picks options. Types such as `FilterOption<{ icon: string }>` add the fields your design reads; they are always optional.

## Editable

Text that reads as text and becomes an input in place. Enter commits, Escape cancels, and blur commits; focus returns to the part that started editing.

```tsx
import { Editable } from "@erbium-ui/react/editable";

<Editable.Root defaultValue="Untitled" onValueChange={(value, { reason }) => save(value)}>
  <Editable.Preview />
  <Editable.Input aria-label="Title" />
</Editable.Root>;
```

## Pagination

Page controls laid out so the number of items stays the same as the page moves. With `onPageChange` the parts are buttons; with `getPageHref`, or a router link passed through `render`, they are links.

```tsx
import { Pagination } from "@erbium-ui/react/pagination";

<nav aria-label="Pagination">
  <Pagination.Root page={page} pageCount={20} onPageChange={setPage}>
    <Pagination.List>
      <Pagination.Previous />
      <Pagination.Items>
        {(item) =>
          item.type === "page" ? (
            <Pagination.Page key={item.page} page={item.page} />
          ) : (
            <Pagination.Ellipsis key={item.key} />
          )
        }
      </Pagination.Items>
      <Pagination.Next />
    </Pagination.List>
  </Pagination.Root>
</nav>;
```

## QR Code

A QR code drawn from SVG parts, with a clear area for a logo and export to PNG or SVG in the colors CSS gives it. It renders on the server.

```tsx
import { QRCode } from "@erbium-ui/react/qr-code";

<QRCode.Root value="https://example.com">
  <QRCode.Svg aria-label="Scan to open example.com">
    <QRCode.Background />
    <QRCode.Modules />
    <QRCode.EyeFrames />
    <QRCode.EyeCenters />
  </QRCode.Svg>
  <QRCode.Download>Download</QRCode.Download>
</QRCode.Root>;
```

## Segmented Control

A sliding indicator for segments whose behavior comes from Base UI: a Radio Group for a value, a Toggle Group for a filter that can be cleared, or links for navigation. Base UI's `Tabs.Indicator` only follows tabs, so this one follows the active direct child of any control: `data-checked`, `data-pressed` or `aria-current="page"`.

```tsx
import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { SegmentedControl } from "@erbium-ui/react/segmented-control";

export const BillingPeriod = () => (
  <RadioGroup aria-label="Billing period" defaultValue="monthly" className="track">
    <Radio.Root value="monthly">Monthly</Radio.Root>
    <Radio.Root value="yearly">Yearly</Radio.Root>
    <SegmentedControl.Indicator className="indicator" />
  </RadioGroup>
);
```

The indicator sets `--active-segment-left`, `--active-segment-top`, `--active-segment-width` and `--active-segment-height`, measured inside the control, and stays `hidden` until a segment is active. Position it absolutely in the control and transition `translate`, `width` and `height`.

## Slider

Base UI's slider with uneven `steps`, a `"log"` or custom `scale`, and `marks`. Callbacks, form values and announced values stay real values while Base UI runs on track positions.

```tsx
import { Slider } from "@erbium-ui/react/slider";

<Slider.Root scale="log" min={20} max={20000} defaultValue={440} marks>
  <Slider.Control>
    <Slider.Track>
      <Slider.Indicator />
    </Slider.Track>
    <Slider.Marks>{(mark) => <Slider.Mark mark={mark} />}</Slider.Marks>
    <Slider.Thumbs aria-label="Frequency" />
  </Slider.Control>
</Slider.Root>;
```

## Stepper

A multi-step flow: steps identified by id, required, optional, disabled or a final review, with guards that check the current step before it is left. The flow is a pure state machine in `stepper/core`; every action resolves to a result with a reason, and only one move runs at a time.

```tsx
import { Stepper } from "@erbium-ui/react/stepper";

<Stepper.Root steps={[{ id: "account" }, { id: "extras", optional: true }]} guard={check}>
  <Stepper.List aria-label="Checkout">
    <Stepper.Item value="account">
      <Stepper.Trigger>Account</Stepper.Trigger>
    </Stepper.Item>
    <Stepper.Item value="extras">
      <Stepper.Trigger>Extras</Stepper.Trigger>
    </Stepper.Item>
  </Stepper.List>
  <Stepper.Panel value="account">…</Stepper.Panel>
  <Stepper.Panel value="extras">…</Stepper.Panel>
  <Stepper.Previous>Back</Stepper.Previous>
  <Stepper.Skip>Skip</Stepper.Skip>
  <Stepper.Next>Next</Stepper.Next>
</Stepper.Root>;
```

`useStepperFormGroup` binds a TanStack Form `FormGroup` named after its step, and `createStepperFormFinish` submits the whole form and returns to the first failing step. TanStack Form is read structurally, not depended on.

## Streaming Response

`useTextStream` collects a model's streamed reply into the `text` and `status` your view renders. `start` takes a `ReadableStream` or an async iterable of text or bytes, or a function that opens one with an abort signal. Rendering the Markdown is up to you.

```tsx
import { useTextStream } from "@erbium-ui/react/streaming-response";

const { text, status, start, stop } = useTextStream();

await start(async (signal) => {
  const response = await fetch("/api/chat", { signal });

  if (!response.ok || !response.body) throw new Error("The model did not respond.");

  return response.body;
});
```

## License

MIT
