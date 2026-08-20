export function createDefaultPermissions(userId, workspaceId) {
  return {
    user_id: userId,
    workspace_id: workspaceId,
    permissions: [
      "workspace.read",
      "workspace.write",
      "execution.run"
    ]
  };
}
