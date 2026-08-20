import "dotenv/config";
import fs from "fs";
import { tools } from "../tools/index.js";

const SYSTEM_PROMPT = fs.readFileSync("src/llm/system.txt", "utf8");






async function runLLM(messages, runtimeTools = tools) {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen/qwen3.6-27b",
        messages,
        tools: TOOL_DEFINITIONS
      })
    }
  );

  const data = await response.json();

  return {
    message:
      data.choices?.[0]?.message?.content || "",
    raw: data,
    usage: data.usage || null,
    model: data.model || null
  };
}

const TOOL_DEFINITIONS = [
  {
    type: "function",
    function: {
      name: "get_workspace_info",
      description: "Get information about the workspace",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_workspace",
      description: "Get workspace information",
      parameters: {
        type: "object",
        properties: {}
      }
    }
  },
  {
    type: "function",
    function: {
      name: "run_command",
      description: "Run a command",
      parameters: {
        type: "object",
        properties: {
          command: { type: "string" },
          workspace: { type: "string" }
        },
        required: ["command"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "list_directory",
      description: "List directory contents",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string" },
          workspace: { type: "string" }
        },
        required: ["path"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "write_file",
      description: "Write a file",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string" },
          content: { type: "string" },
          workspace: { type: "string" }
        },
        required: ["path", "content"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "read_file",
      description: "Read a file",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string" },
          workspace: { type: "string" }
        },
        required: ["path"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "edit_file",
      description: "Edit a file",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string" },
          content: { type: "string" },
          workspace: { type: "string" }
        },
        required: ["path", "content"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "create_directory",
      description: "Create a directory",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string" },
          workspace: { type: "string" }
        },
        required: ["path"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "delete_file",
      description: "Delete a file",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string" },
          workspace: { type: "string" }
        },
        required: ["path"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "delete_directory",
      description: "Delete a directory",
      parameters: {
        type: "object",
        properties: {
          path: { type: "string" },
          workspace: { type: "string" }
        },
        required: ["path"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "search",
      description: "Search the web",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string" }
        },
        required: ["query"]
      }
    }
  }
];

export async function askLLM(messages) {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen/qwen3.6-27b",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT
          },
          ...messages
        ],
        temperature: 0.2,
        tools: TOOL_DEFINITIONS,
        tool_choice: "auto"
      })
    }
  );

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Replication ${response.status}: ${text}`
    );
  }

  const data = JSON.parse(text);

console.log(
  JSON.stringify(data, null, 2)
);
  console.log(JSON.stringify(data, null, 2));

  const assistant =
    data.choices?.[0]?.message;


  if (assistant?.tool_calls) {

    const call =
      assistant.tool_calls[0];


    const name =
      call.function.name;


    const args =
      JSON.parse(
        call.function.arguments
      );


    console.log("REQUESTED TOOL:", name);
    console.log("AVAILABLE TOOLS:", Object.keys(tools));
    console.log("TOOL TYPE:", typeof tools[name]);

    if (typeof tools[name] !== "function") {
      throw new Error(
        `Tool ${name} is not registered`
      );
    }

    const result =
      await tools[name](args);


    const followUp = [
      ...messages,
      {
        role: "assistant",
        content: null,
        tool_calls: [
          {
            id: call.id,
            type: "function",
            function: {
              name,
              arguments: JSON.stringify(args)
            }
          }
        ]
      },
      {
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(result)
      }
    ];


    const finalResponse =
      await runLLM(
        followUp,
        tools
      );


    return {
      message: finalResponse.message,
      model: finalResponse.model,
      usage: finalResponse.usage
    };
  }

  const message =
    data.choices?.[0]?.message;

  if (message?.tool_calls) {
    for (const call of message.tool_calls) {
      const name = call.function.name;

      const args =
        JSON.parse(
          call.function.arguments
        );

      if (!tools[name]) {
        throw new Error(
          `Unknown tool ${name}`
        );
      }

      const result =
        await tools[name](args);

      return {
        tool_call: true,
        name,
        result
      };
    }
  }

  return {
    message:
      data.choices?.[0]?.message?.content || "",
    model:
      "Replication 4.9 Pro",
    usage:
      data.usage || null
  };
}
