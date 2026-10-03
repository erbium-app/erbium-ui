const sources = import.meta.glob<string>("./**/*.{tsx,ts}", {
  eager: true,
  query: "?raw",
  import: "default",
});
export function showcaseSource(path: string) {
  const source = sources[`./${path.replace(/^src\//, "")}`];
  if (!source) throw new Error(`Missing showcase source: ${path}`);
  return source;
}
