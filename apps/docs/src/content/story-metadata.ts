import type { ShowcaseStory } from "@erbium/showcase/catalog";

type Args = NonNullable<ShowcaseStory["args"]>;

type ArgTypes = NonNullable<ShowcaseStory["argTypes"]>;

type ArgType = ArgTypes[string];

const isArgs = (value: unknown): value is Args =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isConstraint = (value: unknown): value is number | undefined =>
  value === undefined || typeof value === "number";

const isControl = (value: unknown): value is ArgType["control"] => {
  if (value === undefined || value === false || typeof value === "string") {
    return true;
  }

  if (!isArgs(value) || typeof value.type !== "string") {
    return false;
  }

  return [value.min, value.max, value.step].every(isConstraint);
};

const isArgType = (value: unknown): value is ArgType =>
  isArgs(value) &&
  isControl(value.control) &&
  (value.options === undefined || Array.isArray(value.options)) &&
  (value.description === undefined || typeof value.description === "string");

const isArgTypes = (value: unknown): value is ArgTypes =>
  isArgs(value) && Object.values(value).every(isArgType);

export const parseStoryMetadata = (variant: { args: string; argTypes: string }) => {
  const args: unknown = JSON.parse(variant.args);
  const argTypes: unknown = JSON.parse(variant.argTypes);

  if (!isArgs(args) || !isArgTypes(argTypes)) {
    throw new Error("Invalid showcase metadata");
  }

  return { argTypes, args };
};
