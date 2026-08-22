
import { authMiddleware } from "../auth.js";
import { AccountService } from "../../auth/accounts.js";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { moderateAvatar, processAvatar } from "../../moderation/avatar.js";

const accounts = new AccountService();

export default async function profileRoutes(app)
{

  app.get("/profile", {
    preHandler: authMiddleware
  }, async (request) => {

    const account =
      accounts.get(request.user.id);

    if (!account)
    {
      return {
        error: "Account not found"
      };
    }

    return {
      id: account.id,
      username: account.username,
      avatar: account.avatar,
      description: account.description
    };
  });


  app.put("/profile/description", {
    preHandler: authMiddleware
  }, async (request) => {

    const { description } = request.body;

    const account =
      accounts.update(
        request.user.id,
        {
          description
        }
      );

    return {
      description: account.description
    };
  });



  app.post("/profile/avatar", {
    preHandler: authMiddleware
  }, async (request, reply) => {

    const file = await request.file();

    if (!file)
    {
      return reply.code(400).send({
        error: "Missing avatar"
      });
    }

    const buffer =
      await file.toBuffer();


    const check =
      await moderateAvatar(buffer);


    if (!check.allowed)
    {
      return reply.code(400).send({
        error: check.reason
      });
    }


    const processed =
      await processAvatar(buffer);


    const filename =
      crypto.randomUUID() + ".png";


    const uploadPath =
      path.join(
        "uploads",
        "avatars",
        filename
      );


    fs.writeFileSync(
      uploadPath,
      processed
    );


    const account =
      accounts.update(
        request.user.id,
        {
          avatar: "/uploads/avatars/" + filename
        }
      );

    return {
      avatar: account.avatar
    };

  });

}


