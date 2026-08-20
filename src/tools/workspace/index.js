import fs from "fs/promises";
import path from "path";

const ROOT =
  path.resolve("workspaces");


export async function getWorkspaceInfo({
  workspace
}) {
  const location =
    path.join(
      ROOT,
      workspace
    );

  const files =
    await fs.readdir(
      location,
      {
        recursive: true
      }
    );

  return {
    workspace,
    files
  };
}
