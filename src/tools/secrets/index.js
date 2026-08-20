import fs from "fs/promises";
import path from "path";

const ROOT =
  path.resolve("replication-secrets");


function getPath(workspace) {
  return path.join(
    ROOT,
    `${workspace}.json`
  );
}


async function load(workspace) {
  try {
    return JSON.parse(
      await fs.readFile(
        getPath(workspace),
        "utf8"
      )
    );
  } catch {
    return {};
  }
}


async function save(
  workspace,
  data
) {
  await fs.mkdir(
    ROOT,
    {
      recursive: true
    }
  );

  await fs.writeFile(
    getPath(workspace),
    JSON.stringify(
      data,
      null,
      2
    ),
    "utf8"
  );
}


export async function createSecret({
  workspace,
  name,
  value
}) {
  const secrets =
    await load(workspace);

  secrets[name] = value;

  await save(
    workspace,
    secrets
  );

  return {
    success: true,
    name
  };
}


export async function getSecret({
  workspace,
  name
}) {
  const secrets =
    await load(workspace);

  return {
    name,
    value:
      secrets[name] || null
  };
}


export async function listSecrets({
  workspace
}) {
  const secrets =
    await load(workspace);

  return Object.keys(secrets);
}


export async function deleteSecret({
  workspace,
  name
}) {
  const secrets =
    await load(workspace);

  delete secrets[name];

  await save(
    workspace,
    secrets
  );

  return {
    success: true
  };
}
