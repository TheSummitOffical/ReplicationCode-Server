import crypto from "crypto";
import { Database } from "../storage/database.js";

const sessions = new Database("sessions");

export class SessionService {

  create(userId) {
    const session = {
      id: crypto.randomUUID(),
      user_id: userId,
      token: crypto.randomBytes(32)
        .toString("hex"),
      created_at: new Date()
        .toISOString()
    };

    sessions.insert(session);

    return session;
  }

  verify(token) {
    return sessions.findOne({
      token
    });
  }

  destroy(token) {
    sessions.remove({
      token
    });
  }
}
