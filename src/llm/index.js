import { chat as groqChat } from "./providers/groq.js";

export async function llmChat(messages, tools) {
  return groqChat(messages, tools);
}
