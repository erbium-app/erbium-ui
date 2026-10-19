import * as React from "react";
import { Icon } from "@erbium/ui/components/icon";

import { Button } from "@erbium/ui/components/button";

const monthFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  month: "long",
  year: "numeric",
});

const monthKeyFormatter = new Intl.DateTimeFormat("en-US-u-ca-persian", {
  month: "numeric",
  year: "numeric",
});

const dayFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", { day: "numeric" });
const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

function moveDay(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);

  return next;
}

function getMonthDays(anchor: Date) {
  const key = monthKeyFormatter.format(anchor);
  let first = new Date(anchor);

  while (monthKeyFormatter.format(moveDay(first, -1)) === key) {
    first = moveDay(first, -1);
  }

  const days: Date[] = [];

  for (let date = first; monthKeyFormatter.format(date) === key; date = moveDay(date, 1)) {
    days.push(date);
  }

  return days;
}

export default function CalendarHijri() {
  const [anchor, setAnchor] = React.useState(() => new Date());
  const [selected, setSelected] = React.useState<Date>();
  const days = getMonthDays(anchor);
  const first = days[0];
  const offset = first ? (first.getDay() + 1) % 7 : 0;

  return (
    <div dir="rtl" className="w-72 rounded-xl border surface-panel p-3 font-sans">
      <div className="mb-3 flex items-center justify-between">
        <Button
          aria-label="ماه قبل"
          size="icon"
          variant="ghost"
          onClick={() => {
            first && setAnchor(moveDay(first, -10));
          }}
        >
          <Icon name="chevron-right" />
        </Button>
        <span className="text-caption font-medium">{monthFormatter.format(anchor)}</span>
        <Button
          aria-label="ماه بعد"
          size="icon"
          variant="ghost"
          onClick={() => {
            first && setAnchor(moveDay(first, 35));
          }}
        >
          <Icon name="chevron-left" />
        </Button>
      </div>
      <div className="grid grid-cols-7 text-center text-caption">
        {weekDays.map((day, index) => (
          <span className="py-2 text-muted-foreground" key={index}>
            {day}
          </span>
        ))}
        {Array.from({ length: offset }, (_, index) => (
          <span key={`empty-${index}`} />
        ))}
        {days.map((date) => {
          const active = selected?.toDateString() === date.toDateString();

          return (
            <Button
              aria-label={new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
                dateStyle: "full",
              }).format(date)}
              aria-pressed={active}
              className="rounded-md"
              key={date.toISOString()}
              size="icon"
              variant={active ? "default" : "ghost"}
              onClick={() => {
                setSelected(date);
              }}
            >
              {dayFormatter.format(date)}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
