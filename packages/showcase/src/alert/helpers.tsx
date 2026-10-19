export const alertContent = {
  default: {
    description: "The agent can read the app and package files for this task.",
    title: "Workspace connected",
  },
  error: {
    description: "The agent could not run the test suite. Check the workspace process.",
    title: "Tool call failed",
  },
  info: {
    description: "The agent identified three files to update before writing code.",
    title: "Plan ready",
  },
  success: {
    description: "Type checks and 42 tests passed after the changes.",
    title: "Verification passed",
  },
  warning: {
    description: "The agent needs permission to install a new dependency.",
    title: "Approval required",
  },
};
