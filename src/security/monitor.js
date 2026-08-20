import crypto from "crypto";
import { Database } from "../storage/database.js";

const usage = new Database("resource_usage");

export class ResourceMonitor {

  start(sandboxId) {

    const record = {
      id: crypto.randomUUID(),

      sandbox_id: sandboxId,

      cpu: 0,

      memory: 0,

      processes: 0,

      started_at:
        new Date().toISOString(),

      status: "running"
    };

    usage.insert(record);

    return record;
  }


  update(id, data) {

    const all =
      usage.read();

    const index =
      all.findIndex(
        item => item.id === id
      );

    if (index === -1) {
      return null;
    }

    all[index] = {
      ...all[index],
      ...data
    };

    usage.write(all);

    return all[index];
  }


  checkLimits(
    resource,
    policy
  ) {

    if (
      resource.cpu >
      policy.cpu_limit
    ) {
      return false;
    }


    if (
      resource.processes >
      policy.process_limit
    ) {
      return false;
    }


    return true;
  }


  stop(id) {

    this.update(
      id,
      {
        status: "stopped",
        ended_at:
          new Date()
          .toISOString()
      }
    );
  }
}
