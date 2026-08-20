import { ExecutionRequests } from "../../execution/requests.js";
import { authMiddleware } from "../auth.js";

const executions = new ExecutionRequests();

export default async function executionRoutes(app) {


  // Create execution job
  app.post(
    "/executions",
    {
      preHandler: authMiddleware
    },
    async (req) => {

      return executions.create({
        ...req.body,
        user_id: req.user.id
      });

    }
  );


  // Get execution status
  app.get(
    "/executions/:id",
    {
      preHandler: authMiddleware
    },
    async (req) => {

      return executions.get(
        req.params.id
      );

    }
  );


  // List project executions
  app.get(
    "/projects/:id/executions",
    {
      preHandler: authMiddleware
    },
    async (req) => {

      return executions.list(
        req.params.id
      );

    }
  );


  // Stop execution
  app.post(
    "/executions/:id/stop",
    {
      preHandler: authMiddleware
    },
    async () => {

      return {
        status: "stop requested"
      };

    }
  );

}
