import crypto from "crypto";
import { Database } from "../storage/database.js";

const tasks = new Database("agent_tasks");

export class AgentTasks {

  create(data) {
    const task = {
      id: crypto.randomUUID(),

      agent_id: data.agent_id,

      project_id: data.project_id,

      prompt: data.prompt,

      status: "queued",

      result: null,

      logs: [],

      created_at: new Date()
        .toISOString()
    };

    tasks.insert(task);

    return task;
  }


  get(id) {
    return tasks.findOne({
      id
    });
  }


  update(id, changes) {
    const all = tasks.read();

    const index = all.findIndex(
      task => task.id === id
    );

    if (index === -1) {
      return null;
    }

    all[index] = {
      ...all[index],
      ...changes
    };

    tasks.write(all);

    return all[index];
  }


  list(agent_id) {
    return tasks.find({
      agent_id
    });
  }
}
