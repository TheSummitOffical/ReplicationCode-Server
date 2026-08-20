import { spawn } from "child_process";

export function runCommand({
  command,
  cwd = process.env.WORKSPACE_ROOT
}) {
  return new Promise((resolve, reject) => {
    if (!command) {
      return reject(new Error("Command is required"));
    }

    if (!cwd) {
      return reject(new Error("Workspace path is missing"));
    }

    const child = spawn(command, {
      cwd,
      shell: true,
      env: process.env
    });

    let stdout = "";
    let stderr = "";

    const timeout = setTimeout(() => {
      child.kill();

      resolve({
        stdout,
        stderr: stderr + "\nCommand timed out",
        exitCode: 124
      });
    }, 30000);

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      clearTimeout(timeout);

      resolve({
        stdout,
        stderr,
        exitCode: code ?? 0
      });
    });

    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}
