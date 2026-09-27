const items = Array.from({ length: 12 }, (_, index) => index + 1);

export default function ScrollFadePreview() {
  return (
    <div className="mx-auto grid w-full max-w-2xl gap-5 sm:grid-cols-2">
      <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <h2 className="border-b px-4 py-3 text-sm font-semibold">Scroll-aware fade</h2>
        <div className="scroll-fade h-56 overflow-y-auto px-4">
          {items.map((item) => (
            <div key={item} className="border-b py-4 text-sm text-neutral-700">
              Scrollable item {item}
            </div>
          ))}
        </div>
      </section>
      <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <h2 className="border-b px-4 py-3 text-sm font-semibold">Horizontal and RTL-ready</h2>
        <div dir="rtl" className="scroll-fade-x flex h-56 gap-3 overflow-x-auto p-4">
          {items.map((item) => (
            <div
              key={item}
              className="grid h-full min-w-32 shrink-0 place-items-center rounded-lg bg-neutral-100 text-sm text-neutral-700"
            >
              Card {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
