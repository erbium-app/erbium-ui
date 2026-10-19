import config from "ultracite/stylelint";

// The shape Ultracite's own CLI generates: carry the preset's config
// (including its ignoreFiles globs) at the project level so they resolve
// against this repo's files rather than node_modules. Repo-specific build
// outputs live in .stylelintignore.
export default { ...config };
