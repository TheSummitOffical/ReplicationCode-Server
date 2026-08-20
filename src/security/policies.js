import crypto from "crypto";
import { Database } from "../storage/database.js";

const policies = new Database("policies");

export class SecurityPolicies {

  create(data) {
    const policy = {
      id: crypto.randomUUID(),
      project_id: data.project_id,

      cpu_limit: data.cpu_limit || 1,
      memory_limit: data.memory_limit || "512MB",
      process_limit: data.process_limit || 20,

      network: data.network || "restricted",

      created_at: new Date()
        .toISOString()
    };

    policies.insert(policy);

    return policy;
  }

  get(project_id) {
    return policies.findOne({
      project_id
    });
  }

  checkExecution(request, policy) {

    if (!policy) {
      throw new Error(
        "No security policy"
      );
    }

    return {
      allowed: true,
      limits: {
        cpu: policy.cpu_limit,
        memory: policy.memory_limit,
        processes: policy.process_limit,
        network: policy.network
      }
    };
  }

  update(id, changes) {
    const all = policies.read();

    const index = all.findIndex(
      item => item.id === id
    );

    if (index === -1) {
      return null;
    }

    all[index] = {
      ...all[index],
      ...changes
    };

    policies.write(all);

    return all[index];
  }
}
