import crypto from "crypto";
import { Database } from "../storage/database.js";

const permissions = new Database("permissions");

export class PermissionManager {

  grant(data) {
    const permission = {
      id: crypto.randomUUID(),

      user_id: data.user_id,

      project_id: data.project_id,

      role: data.role || "viewer",

      created_at: new Date()
        .toISOString()
    };

    permissions.insert(
      permission
    );

    return permission;
  }


  get(user_id, project_id) {
    return permissions.findOne({
      user_id,
      project_id
    });
  }


  check(
    user_id,
    project_id,
    required
  ) {
    const permission =
      this.get(
        user_id,
        project_id
      );

    if (!permission) {
      return false;
    }

    const roles = {
      viewer: 1,
      developer: 2,
      owner: 3
    };

    return (
      roles[permission.role] >=
      roles[required]
    );
  }


  revoke(user_id, project_id) {
    permissions.remove({
      user_id,
      project_id
    });
  }
}
