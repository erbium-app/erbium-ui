---
title: "Selected Date (With TimeZone)"
story: SelectedDateWithTimezone
---

The Calendar component accepts a `timeZone` prop to ensure dates are displayed and selected in the user's local timezone.

**Note:** If you notice a selected date offset (for example, selecting the 20th highlights the 19th), make sure the `timeZone` prop is set to the user's local timezone.

**Why client-side?** The timezone is detected using `Intl.DateTimeFormat().resolvedOptions().timeZone` inside a `useEffect` to ensure compatibility with server-side rendering. Detecting the timezone during render would cause hydration mismatches, as the server and client may be in different timezones.
