import fs from "fs/promises";

export async function getWorkspaceInfo() {
  const workspace =
    process.env.WORKSPACE_ROOT;

  try {
    const files = await fs.readdir(workspace);

    return {
      workspace,
      exists: true,
      entries: files
    };
  } catch {
    return {
      workspace,
      exists: false,
      entries: []
    };
  }
}
