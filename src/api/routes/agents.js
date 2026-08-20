import { AgentManager } from "../../agents/manager.js";
import { AgentTasks } from "../../agents/tasks.js";
import { authMiddleware } from "../auth.js";

const agents = new AgentManager();
const tasks = new AgentTasks();

export default async function agentRoutes(app) {


  // Create an AI agent
  app.post(
    "/agents",
    {
      preHandler: authMiddleware
    },
    async (req) => {

      return agents.create({
        ...req.body,
        owner_id: req.user.id
      });

    }
  );


  // List agents for a project
  app.get(
    "/projects/:id/agents",
    {
      preHandler: authMiddleware
    },
    async (req) => {

      return agents.list(
        req.params.id
      );

    }
  );


  // Create an agent task
  app.post(
    "/agents/:id/tasks",
    {
      preHandler: authMiddleware
    },
    async (req) => {

      const agent =
        agents.get(
          req.params.id
        );

      return tasks.create({
        agent_id: agent.id,
        project_id: agent.project_id,
        prompt: req.body.prompt
      });

    }
  );


  // View task results
  app.get(
    "/agents/:id/tasks",
    {
      preHandler: authMiddleware
    },
    async (req) => {

      return tasks.list(
        req.params.id
      );

    }
  );


  // Get single task result
  app.get(
    "/tasks/:id",
    {
      preHandler: authMiddleware
    },
    async (req) => {

      return tasks.get(
        req.params.id
      );

    }
  );

}
