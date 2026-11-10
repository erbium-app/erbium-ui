import type { CodeBlockTokens } from "@erbium/ui/blocks/code-block";

/** Build-time highlighted code for one page, keyed by `highlightKey`. */
export type CodeHighlights = Record<string, CodeBlockTokens>;

// Two polynomial hashes over large primes. Products stay below 2^53, so the result
// is exact, and keys hold no source text: Start's loader-data serializer escapes
// newlines in object keys, which would break any key built from the code itself.
const primes = [4_294_967_291, 2_147_483_647] as const;

/** A short key both the build and the renderer derive from a fence's language and text. */
export const highlightKey = (language: string, code: string) => {
  let first = 0;
  let second = 0;

  for (const character of `${language}\u0000${code}`) {
    const point = character.codePointAt(0) ?? 0;
    first = (first * 131 + point) % primes[0];
    second = (second * 137 + point) % primes[1];
  }

  return `${first.toString(36)}.${second.toString(36)}`;
};
