import crypto from "crypto";
import { Database } from "../storage/database.js";

const networks = new Database("network_policies");

export class NetworkPolicy {

  create(data) {
    const policy = {
      id: crypto.randomUUID(),

      project_id: data.project_id,

      mode:
        data.mode || "restricted",

      allowed_domains:
        data.allowed_domains || [],

      blocked_ports:
        data.blocked_ports || [
          22,
          23
        ],

      created_at:
        new Date().toISOString()
    };

    networks.insert(policy);

    return policy;
  }


  get(project_id) {
    return networks.findOne({
      project_id
    });
  }


  check(policy, request) {

    if (!policy) {
      return false;
    }

    if (
      policy.mode === "blocked"
    ) {
      return false;
    }

    return true;
  }


  update(id, changes) {
    const all =
      networks.read();

    const index =
      all.findIndex(
        item => item.id === id
      );

    if (index === -1) {
      return null;
    }

    all[index] = {
      ...all[index],
      ...changes
    };

    networks.write(all);

    return all[index];
  }
}
