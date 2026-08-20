
import { runCommand } from "../../tools/run_command.js";

export default async function shellRoutes(app) {

  app.post("/shell", async (req, reply) => {

    const { command } = req.body || {};

    if (!command) {
      return reply.code(400).send({
        error: "command required"
      });
    }

    const result = await runCommand({
      command
    });

    return {
      command,
      result
    };
  });

}
