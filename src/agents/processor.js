import { AgentTasks } from "./tasks.js";
import { ExecutionRequests } from "../execution/requests.js";

export class AgentProcessor {

  constructor() {
    this.tasks = new AgentTasks();
    this.executions = new ExecutionRequests();
  }


  createExecutionFromTask(task) {

    const execution =
      this.executions.create({
        user_id: task.owner_id,
        workspace_id: task.project_id,

        project_id: task.project_id,

        command: "node",

        args: [
          "agent.js"
        ]
      });

    this.tasks.update(
      task.id,
      {
        status: "running",
        execution_id: execution.id
      }
    );

    return execution;
  }


  completeTask(
    taskId,
    result
  ) {

    return this.tasks.update(
      taskId,
      {
        status: "completed",
        result
      }
    );
  }
}
