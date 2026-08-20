import fs from "fs/promises";
import path from "path";

const ROOT = path.resolve("workspaces");

function safePath(workspace, filePath = "") {
  const full = path.resolve(
    ROOT,
    workspace,
    filePath
  );

  if (!full.startsWith(path.resolve(ROOT))) {
    throw new Error("Invalid path");
  }

  return full;
}


export async function listDirectory({
  workspace,
  path: dir = ""
}) {
  const target = safePath(workspace, dir);

  return await fs.readdir(target, {
    withFileTypes: true
  });
}


export async function readFile({
  workspace,
  path: file
}) {
  return await fs.readFile(
    safePath(workspace, file),
    "utf8"
  );
}


export async function writeFile({
  workspace,
  path: file,
  content
}) {
  const target = safePath(workspace, file);

  await fs.mkdir(
    path.dirname(target),
    { recursive: true }
  );

  await fs.writeFile(
    target,
    content,
    "utf8"
  );

  return {
    success: true,
    path: file
  };
}


export async function createDirectory({
  workspace,
  path: dir
}) {
  await fs.mkdir(
    safePath(workspace, dir),
    {
      recursive: true
    }
  );

  return {
    success: true,
    path: dir
  };
}


export async function deleteFile({
  workspace,
  path: file
}) {
  await fs.unlink(
    safePath(workspace, file)
  );

  return {
    success: true
  };
}


export async function deleteDirectory({
  workspace,
  path: dir
}) {
  await fs.rm(
    safePath(workspace, dir),
    {
      recursive: true,
      force: true
    }
  );

  return {
    success: true
  };
}


export async function editFile({
  workspace,
  path: file,
  oldText,
  newText
}) {
  const target = safePath(workspace, file);

  const content = await fs.readFile(
    target,
    "utf8"
  );

  if (!content.includes(oldText)) {
    throw new Error("Text not found");
  }

  await fs.writeFile(
    target,
    content.replace(oldText, newText),
    "utf8"
  );

  return {
    success: true,
    path: file
  };
}
