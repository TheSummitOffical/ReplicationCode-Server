import { askLLM } from "../../llm/service.js";
import { authMiddleware } from "../auth.js";

export default async function llmRoutes(app) {

  app.post(
    "/llm/chat",
    {
      preHandler: authMiddleware
    },
    async (req, reply) => {

      if (!req.body?.messages) {
        return reply.code(400).send({
          error: "messages required"
        });
      }

      const result = await askLLM(
        req.body.messages
      );

      return {
        result
      };
    }
  );

}
