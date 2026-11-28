import { getTextDirection } from "@erbium-ui/react/relative-time/core";
import { RelativeTime, RelativeTimeProvider } from "@erbium/ui/components/relative-time";
import { DAY, HOUR, useDemoClock } from "../examples/use-demo-clock";

const languages = [
  { locale: "en", name: "English" },
  { locale: "de", name: "Deutsch" },
  { locale: "ja", name: "日本語" },
  { locale: "fa-IR", name: "فارسی" },
  { locale: "ar", name: "العربية" },
  { locale: "he", name: "עברית" },
];

export default function RelativeTimeLanguagesExample() {
  const now = useDemoClock();
  const dates = [now - 740 * DAY, now - 3 * HOUR, now, now + 4 * DAY, now + 65 * DAY];

  return (
    <div className="grid w-full gap-section sm:grid-cols-2 lg:grid-cols-3">
      {languages.map(({ locale, name }) => (
        // One provider writes every time inside it in its language and direction.
        <RelativeTimeProvider key={locale} locale={locale}>
          <section lang={locale} dir={getTextDirection(locale)} className="flex flex-col gap-1">
            <h3 className="text-control">{name}</h3>
            {dates.map((date) => (
              <RelativeTime key={date} date={date} className="text-caption text-muted-foreground" />
            ))}
          </section>
        </RelativeTimeProvider>
      ))}
    </div>
  );
}
