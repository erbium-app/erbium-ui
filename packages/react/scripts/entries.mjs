import path from "node:path";
import entries from "../entries.json" with { type: "json" };

const packageRoot = path.dirname(import.meta.dirname);
const { client: clientEntries, facades, server: serverEntries } = entries;

export { clientEntries, facades, packageRoot, serverEntries };
