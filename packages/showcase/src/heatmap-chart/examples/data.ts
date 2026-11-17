export const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const hours = ["9am", "11am", "1pm", "3pm", "5pm", "7pm"];

export const orders = days.flatMap((day, dayIndex) =>
  hours.map((hour, hourIndex) => ({
    day,
    hour,
    orders: Math.round(
      20 + 30 * Math.sin((hourIndex + 1) / 2) + (dayIndex < 5 ? 15 : -10) + ((dayIndex * 7) % 11),
    ),
  })),
);
