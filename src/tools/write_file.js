import fs from "fs/promises";
import path from "path";

export async function writeFile({
  file,
  path: filePath,
  content
} = {}) {

  const filename = file || filePath;

  if (!filename) {
    throw new Error("write_file requires a file path");
  }

  const target = path.resolve(
    process.env.WORKSPACE_ROOT,
    filename
  );

  await fs.mkdir(
    path.dirname(target),
    { recursive: true }
  );

  await fs.writeFile(
    target,
    content || "",
    "utf8"
  );

  return {
    success: true,
    file: filename
  };
}
