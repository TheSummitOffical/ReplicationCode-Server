
import crypto from "crypto";

const sessions = new Map();

export function getSession(id) {
  return sessions.get(id);
}

export function createSession() {
  const session = {
    id: crypto.randomUUID(),
    cwd: process.env.WORKSPACE_ROOT || "/replication/workspaces"
  };

  sessions.set(session.id, session);

  return session;
}

export function updateSession(id, data) {
  const session = sessions.get(id);

  if (!session)
    return null;

  Object.assign(session, data);

  return session;
}
