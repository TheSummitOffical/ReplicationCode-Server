
import os from "os";
import { execSync } from "child_process";

export default async function resourcesRoutes(app) {

  app.get("/resources", async () => {

    let disk = "";
    let memory = "";

    try {
      disk = execSync("df -h / | tail -1")
        .toString()
        .trim();
    } catch {}

    try {
      memory = execSync("free -h")
        .toString();
    } catch {}

    return {
      container: process.env.HOSTNAME || "unknown",

      cpu: {
        cores: os.cpus().length,
        architecture: process.arch
      },

      memory,

      disk,

      workspace:
        process.env.WORKSPACE_ROOT ||
        "/replication/workspaces"
    };
  });

}
