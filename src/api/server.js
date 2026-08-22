import multipart from "@fastify/multipart";
import staticPlugin from "@fastify/static";
import path from "path";

import resourcesRoutes from "./routes/resources.js";
import shellRoutes from "./routes/shell.js";
import profileRoutes from "./routes/profile.js";
import Fastify from "fastify";

import { AccountService } from "../auth/accounts.js";
import { WorkspaceManager } from "../workspace/manager.js";
import { AgentManager } from "../agents/manager.js";
import { ExecutionRequests } from "../execution/requests.js";
import { PermissionManager } from "../permissions/manager.js";
import { authMiddleware } from "./auth.js";
import { SessionService } from "../auth/sessions.js";
import llmRoutes from "./routes/llm.js";

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info",
    redact: [
      "password",
      "password_hash",
      "token",
      "session",
      "authorization"
    ],
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname"
      }
    }
  }
});

const accounts = new AccountService();
const workspaces = new WorkspaceManager();
const agents = new AgentManager();
const executions = new ExecutionRequests();
const permissions = new PermissionManager();

await app.register(multipart);

await app.register(staticPlugin, {
  root: path.join(process.cwd(), "uploads"),
  prefix: "/uploads/"
});


await app.register(llmRoutes);


// Account creation
app.post("/accounts", async (req) => {
  return accounts.create(
    req.body
  );
});


// Login
app.post("/login", async (req, reply) => {
  const account = accounts.login(
    req.body.username,
    req.body.password
  );

  if (!account) {
    return reply.code(401).send({
      error: "Invalid credentials"
    });
  }

  const session = new SessionService().create(
    account.id
  );

  return {
    token: session.token,
    user: account
  };
});


// Create workspace
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


// Create agent
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


// Create execution request
app.post(
  "/executions",
  {
    preHandler: authMiddleware
  },
  async (req, reply) => {

    const allowed =
      permissions.check(
        req.user.id,
        req.body.project_id,
        "developer"
      );

    if (!allowed) {
      return reply.code(403).send({
        error: "No execution permission"
      });
    }

    return executions.create({
      ...req.body,
      user_id: req.user.id
    });
  }
);




app.get(
  "/workspaces/:id",
  {
    preHandler: authMiddleware
  },
  async (req, reply) => {

    const allowed =
      permissions.check(
        req.user.id,
        req.params.id,
        "viewer"
      );

    if (!allowed) {
      return reply.code(403).send({
        error: "Access denied"
      });
    }

    return workspaces.get(
      req.params.id
    );
  }
);

app.get("/health", async () => {
  return {
    status: "ok",
    service: "replicationcode-server"
  };
});


await app.register(shellRoutes);
await app.register(profileRoutes);
await app.register(resourcesRoutes);



app.get("/whoami", {
  preHandler: authMiddleware
}, async (request) => {

  const accountService =
    new AccountService();

  const account =
    accountService.get(
      request.user.id
    );

  if (!account) {
    return {
      error: "Account not found"
    };
  }

  return {
    id: account.id,
    username: account.username,
    email: account.email,
    avatar: account.avatar,
    description: account.description,
    created_at: account.created_at
  };

});

export default app;
