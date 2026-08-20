import fs from "fs/promises";
import path from "path";

export async function deleteDirectory({ directory }) {
  const target = path.resolve(
    process.env.WORKSPACE_ROOT,
    directory
  );

  await fs.rm(target, {
    recursive: true,
    force: true
  });

  return {
    success: true,
    directory
  };
}
