import fs from "fs/promises";
import path from "path";

export async function deleteFile({ file }) {
  const target = path.resolve(
    process.env.WORKSPACE_ROOT,
    file
  );

  await fs.unlink(target);

  return {
    success: true,
    file
  };
}
