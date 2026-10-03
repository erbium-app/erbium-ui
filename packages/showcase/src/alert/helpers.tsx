export const alertContent = {
  default: {
    title: "Workspace connected",
    description: "The agent can read the app and package files for this task.",
  },
  error: {
    title: "Tool call failed",
    description: "The agent could not run the test suite. Check the workspace process.",
  },
  info: {
    title: "Plan ready",
    description: "The agent identified three files to update before writing code.",
  },
  success: {
    title: "Verification passed",
    description: "Type checks and 42 tests passed after the changes.",
  },
  warning: {
    title: "Approval required",
    description: "The agent needs permission to install a new dependency.",
  },
};
