const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function chat(messages, tools) {
  const response = await fetch(
    GROQ_URL,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL,
        messages,
        tools,
        tool_choice: "auto",
        temperature: 0.2
      })
    }
  );

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Groq error ${response.status}: ${text}`
    );
  }

  return JSON.parse(text);
}
