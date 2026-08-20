import { WorkspaceManager } from "../../workspace/manager.js";
import { WorkspaceFiles } from "../../workspace/files.js";
import { authMiddleware } from "../auth.js";

const workspaces = new WorkspaceManager();
const files = new WorkspaceFiles();

export default async function workspaceRoutes(app) {

  app.post(
    "/workspaces",
    {
      preHandler: authMiddleware
    },
    async (req) => {

      return workspaces.create(
        req.user.id,
        req.body.name
      );

    }
  );


  app.get(
    "/workspaces",
    {
      preHandler: authMiddleware
    },
    async (req) => {

      return workspaces.list(
        req.user.id
      );

    }
  );


  app.post(
    "/workspaces/:id/files",
    {
      preHandler: authMiddleware
    },
    async (req) => {

      const workspace =
        workspaces.get(
          req.params.id
        );

      return files.create(
        workspace,
        req.body.path,
        req.body.content
      );

    }
  );


  app.get(
    "/workspaces/:id/files/:file",
    {
      preHandler: authMiddleware
    },
    async (req) => {

      const workspace =
        workspaces.get(
          req.params.id
        );

      return files.read(
        workspace,
        req.params.file
      );

    }
  );

}
