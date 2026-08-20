import crypto from "crypto";
import { Database } from "../storage/database.js";

const executions = new Database("executions");

export class ExecutionRequests {

  create(data) {
    const request = {
      id: crypto.randomUUID(),
      user_id: data.user_id,
      workspace_id: data.workspace_id,
      command: data.command,
      args: data.args || [],
      status: "queued",
      logs: [],
      created_at: new Date()
        .toISOString()
    };

    executions.insert(request);

    return request;
  }

  get(id) {
    return executions.findOne({
      id
    });
  }

  update(id, changes) {
    const all = executions.read();

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

    executions.write(all);

    return all[index];
  }

  list(workspace_id) {
    return executions.find({
      workspace_id
    });
  }
}
