import fs from "fs/promises";
import path from "path";

export async function editFile({
  file,
  search,
  replace
}) {
  const target = path.resolve(
    process.env.WORKSPACE_ROOT,
    file
  );

  const content = await fs.readFile(
    target,
    "utf8"
  );

  const updated = content.replace(
    search,
    replace
  );

  await fs.writeFile(
    target,
    updated,
    "utf8"
  );

  return {
    success: true,
    file
  };
}
