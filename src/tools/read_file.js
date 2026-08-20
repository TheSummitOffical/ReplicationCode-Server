import fs from "fs/promises";
import path from "path";

export async function readFile({
  file
}) {
  const target = path.resolve(
    process.env.WORKSPACE_ROOT,
    file
  );

  const content = await fs.readFile(
    target,
    "utf8"
  );

  return {
    file,
    content
  };
}
