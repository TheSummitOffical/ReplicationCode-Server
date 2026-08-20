import fs from "fs/promises";
import path from "path";

export async function createDirectory({
  workspace,
  path: directory
}) {
  console.log("CREATE DIRECTORY ARGS:", {
    workspace,
    directory
  });

  const fullPath = path.join(
    workspace || process.cwd(),
    directory || ""
  );

  await fs.mkdir(fullPath, {
    recursive: true
  });

  return {
    success: true,
    path: fullPath
  };
}
