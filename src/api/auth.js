import { SessionService } from "../auth/sessions.js";

const sessions = new SessionService();

export async function authMiddleware(
  request,
  reply
) {
  const token =
    request.headers.authorization
      ?.replace("Bearer ", "");

  if (!token) {
    return reply.code(401).send({
      error: "Missing token"
    });
  }

  const session =
    sessions.verify(token);

  if (!session) {
    return reply.code(401).send({
      error: "Invalid token"
    });
  }

  request.user = {
    id: session.user_id
  };
}
