import fs from "fs/promises";

export async function listDirectory({
  directory
} = {}) {

  const target =
    directory || process.env.WORKSPACE_ROOT || "/replication/workspaces";

  const files = await fs.readdir(target, {
    withFileTypes: true
  });

  return files.map(file => ({
    name: file.name,
    type: file.isDirectory()
      ? "directory"
      : "file"
  }));
}
