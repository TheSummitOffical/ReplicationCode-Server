
import fetch from "node-fetch";
import { getSession } from "../auth/session.js";

export async function shellCommand(args) {
  const command = args.join(" ");

  if (!command) {
    console.error("Usage: replication shell <command>");
    process.exit(1);
  }

  const session = getSession();

  const res = await fetch(
    `${session.url}/shell`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session.token}`
      },
      body: JSON.stringify({
        command
      })
    }
  );

  const data = await res.json();

  if (data.result) {
    process.stdout.write(data.result.stdout || "");
    process.stderr.write(data.result.stderr || "");
    process.exitCode = data.result.exitCode;
  } else {
    console.error(data);
    process.exit(1);
  }
}
