import { Database } from "../storage/database.js";
import { SecurityPolicies } from "../security/policies.js";
import { ResourceMonitor } from "../security/monitor.js";

const executions = new Database("executions");

export class ExecutionWorker {

  constructor(isolation) {
    this.isolation = isolation;
    this.security = new SecurityPolicies();

    this.monitor =
      new ResourceMonitor();
  }


  async run(id) {

    const request =
      executions.findOne({
        id
      });

    if (!request) {
      throw new Error(
        "Execution not found"
      );
    }


    executions.update(
      id,
      {
        status: "starting"
      }
    );


    const policy =
      this.security.get(
        request.project_id
      );


    this.security.checkExecution(
      request,
      policy
    );


    executions.update(
      id,
      {
        status: "running"
      }
    );


    const process =
      this.isolation.exec(
        request.command,
        request.args
      );

    const resource =
      this.monitor.start(
        request.workspace_id
      );


    process.stdout.on(
      "data",
      data => {
        const current =
          executions.findOne({
            id
          });

        executions.update(
          id,
          {
            logs: [
              ...current.logs,
              data.toString()
            ]
          }
        );
      }
    );


    process.on(
      "exit",
      code => {

        this.monitor.stop(
          resource.id
        );

        executions.update(
          id,
          {
            status:
              code === 0
                ? "completed"
                : "failed"
          }
        );

      }
    );
  }
}
