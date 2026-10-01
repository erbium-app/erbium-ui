declare module "@erbium/ui/globals.css" {
  const css: string;
  export default css;
}

declare module "*.tsx?raw" {
  const source: string;
  export default source;
}
