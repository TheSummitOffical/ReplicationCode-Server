
import { spawn } from "child_process";

export function runApk({
  command,
  cwd
}) {
  return new Promise((resolve, reject) => {

    const args = command.trim().split(" ");

    const child = spawn(
      "su",
      [
        "apk",
        "-c",
        command
      ],
      {
        cwd,
        shell: true,
        env: process.env
      }
    );

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", data => {
      stdout += data.toString();
    });

    child.stderr.on("data", data => {
      stderr += data.toString();
    });

    child.on("close", code => {
      resolve({
        stdout,
        stderr,
        exitCode: code ?? 0
      });
    });

    child.on("error", reject);
  });
}
