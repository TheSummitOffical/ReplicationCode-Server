
import { getPTY } from "../../tools/pty_sessions.js";

export default async function shellRoutes(app) {

  app.post("/shell", async (req, reply) => {

    const { command, cwd, session_id } = req.body || {};

    if (!command) {
      return reply.code(400).send({
        error: "command required"
      });
    }

    if (!session_id) {
      return reply.code(400).send({
        error: "session_id required"
      });
    }

    const terminal = getPTY(
      session_id,
      cwd || process.env.WORKSPACE_ROOT
    );

    let output = "";

    terminal.onData((data) => {
      output += data;
    });

    terminal.write(command + "\r");

    await new Promise(resolve => setTimeout(resolve, 100));

    return {
      command,
      output
    };
  });

}
