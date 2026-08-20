import crypto from "crypto";
import { Database } from "../storage/database.js";

const agents = new Database("agents");

export class AgentManager {

  create(data) {
    const agent = {
      id: crypto.randomUUID(),

      name: data.name,

      owner_id: data.owner_id,

      project_id: data.project_id,

      status: "idle",

      tools: data.tools || [
        "workspace",
        "execution"
      ],

      created_at: new Date()
        .toISOString()
    };

    agents.insert(agent);

    return agent;
  }

  get(id) {
    return agents.findOne({
      id
    });
  }

  list(project_id) {
    return agents.find({
      project_id
    });
  }

  update(id, changes) {
    const all = agents.read();

    const index = all.findIndex(
      agent => agent.id === id
    );

    if (index === -1) {
      return null;
    }

    all[index] = {
      ...all[index],
      ...changes
    };

    agents.write(all);

    return all[index];
  }

  delete(id) {
    agents.remove({
      id
    });
  }
}
