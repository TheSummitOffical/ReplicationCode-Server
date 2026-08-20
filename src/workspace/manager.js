import fs from "fs";
import path from "path";
import crypto from "crypto";
import { Database } from "../storage/database.js";
import { createDefaultPermissions } from "../security/defaults.js";

const workspaces = new Database("workspaces");

const ROOT = path.resolve("data/workspaces");

export class WorkspaceManager {

  create(userId, name) {
    const id = crypto.randomUUID();

    const location = path.join(
      ROOT,
      userId,
      id
    );

    fs.mkdirSync(
      location,
      {
        recursive: true
      }
    );

    const workspace = {
      id,
      user_id: userId,
      name,
      path: location,
      created_at: new Date()
        .toISOString()
    };

    workspaces.insert(workspace);

    const permissions = createDefaultPermissions(
      userId,
      id
    );

    const permissionDb = new Database("permissions");

    permissionDb.insert(permissions);

    return workspace;
  }

  get(id) {
    return workspaces.findOne({
      id
    });
  }

  list(userId) {
    return workspaces.find({
      user_id: userId
    });
  }

  delete(id) {
    const workspace = this.get(id);

    if (!workspace) {
      return;
    }

    fs.rmSync(
      workspace.path,
      {
        recursive: true,
        force: true
      }
    );

    workspaces.remove({
      id
    });
  }
}
