---
title: "Radar Chart"
description: "Compare a few series across five to eight shared axes."
---

## Usage

Pass one row per axis, with one numeric field per series. Set `max` when several radar charts should be compared, so their outer rings mean the same value.

```tsx
import { RadarChart } from "@erbium/ui/charts/radar-chart";

<RadarChart ariaLabel="Skills by player" data={skills} index="skill" series={players} max={100} />;
```

Radar charts need axes on the same scale. With fewer than five axes, or axes in different units, use a [Bar Chart](/docs/charts/bar-chart).
