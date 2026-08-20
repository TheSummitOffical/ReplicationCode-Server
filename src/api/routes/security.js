import { SecurityPolicies } from "../../security/policies.js";
import { NetworkPolicy } from "../../security/network.js";
import { authMiddleware } from "../auth.js";

const policies = new SecurityPolicies();
const networks = new NetworkPolicy();

export default async function securityRoutes(app) {


  // Create resource policy
  app.post(
    "/projects/:id/security",
    {
      preHandler: authMiddleware
    },
    async (req) => {

      return policies.create({
        project_id: req.params.id,

        cpu_limit:
          req.body.cpu_limit,

        memory_limit:
          req.body.memory_limit,

        process_limit:
          req.body.process_limit
      });

    }
  );


  // Get resource policy
  app.get(
    "/projects/:id/security",
    {
      preHandler: authMiddleware
    },
    async (req) => {

      return policies.get(
        req.params.id
      );

    }
  );


  // Create network policy
  app.post(
    "/projects/:id/network",
    {
      preHandler: authMiddleware
    },
    async (req) => {

      return networks.create({
        project_id:
          req.params.id,

        mode:
          req.body.mode,

        allowed_domains:
          req.body.allowed_domains,

        blocked_ports:
          req.body.blocked_ports
      });

    }
  );


  // Get network policy
  app.get(
    "/projects/:id/network",
    {
      preHandler: authMiddleware
    },
    async (req) => {

      return networks.get(
        req.params.id
      );

    }
  );

}
