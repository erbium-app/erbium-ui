type ChartTextRole = "metadata" | "control";

// Chart legends require pixel numbers, not CSS lengths. Read the same tokens
// used by HTML; defaults also make definitions safe to construct during SSR.
export function chartTextRole(role: ChartTextRole) {
  const fallback =
    role === "metadata" ? { fontSize: 12, fontWeight: 400 } : { fontSize: 14, fontWeight: 500 };
  if (typeof document === "undefined") return fallback;

  const styles = getComputedStyle(document.documentElement);
  const scaleRole = role === "metadata" ? "control-sm" : "control";
  const size = styles.getPropertyValue(`--text-${scaleRole}`).trim();
  const weight =
    role === "metadata"
      ? 400
      : Number.parseFloat(styles.getPropertyValue("--text-control--font-weight"));
  const rootSize = Number.parseFloat(styles.fontSize);
  const value = Number.parseFloat(size);
  const pixels = size.endsWith("rem") ? value * rootSize : size.endsWith("px") ? value : Number.NaN;

  return {
    fontSize: Number.isFinite(pixels) ? pixels : fallback.fontSize,
    fontWeight: Number.isFinite(weight) ? weight : fallback.fontWeight,
  };
}
