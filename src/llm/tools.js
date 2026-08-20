export const TOOL_DEFINITIONS = [
  {
    type: "function",
    function: {
      name: "run_command",
      description: "Execute a development command inside the user's workspace.",
      parameters: {
        type: "object",
        properties: {
          command: {
            type: "string",
            description: "The command to execute"
          },
          cwd: {
            type: "string",
            description: "The working directory"
          }
        },
        required: ["command"]
      }
    }
  }
];
