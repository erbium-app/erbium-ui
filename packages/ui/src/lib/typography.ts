type ChartTextRole = "metadata" | "control";

// Chart legends require pixel numbers, not CSS lengths. Read the same tokens
// used by HTML; defaults also make definitions safe to construct during SSR.
export function chartTextRole(role: ChartTextRole) {
  const fallback =
    role === "metadata" ? { fontSize: 12, fontWeight: 400 } : { fontSize: 14, fontWeight: 500 };
  if (typeof document === "undefined") return fallback;

  const styles = getComputedStyle(document.documentElement);
  const size = styles.getPropertyValue(`--text-${role}`).trim();
  const weight = Number.parseFloat(styles.getPropertyValue(`--text-${role}--font-weight`));
  const rootSize = Number.parseFloat(styles.fontSize);
  const value = Number.parseFloat(size);
  const pixels = size.endsWith("rem") ? value * rootSize : size.endsWith("px") ? value : Number.NaN;

  return {
    fontSize: Number.isFinite(pixels) ? pixels : fallback.fontSize,
    fontWeight: Number.isFinite(weight) ? weight : fallback.fontWeight,
  };
}
