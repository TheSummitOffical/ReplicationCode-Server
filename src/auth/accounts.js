import crypto from "crypto";
import { Database } from "../storage/database.js";

const accounts = new Database("accounts");

function hashPassword(password) {
  return crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");
}

export class AccountService {

  create(data) {
    const account = {
      id: crypto.randomUUID(),
      username: data.username,
      email: data.email,
      password_hash: hashPassword(
        data.password
      ),
      google_id: data.google_id || null,
      avatar: data.avatar || null,
      description: data.description || "",
      created_at: new Date().toISOString()
    };

    accounts.insert(account);

    return account;
  }

  login(username, password) {
    const account = accounts.findOne({
      username
    });

    if (!account) {
      return null;
    }

    if (
      account.password_hash !==
      hashPassword(password)
    ) {
      return null;
    }

    return {
      id: account.id,
      username: account.username,
      email: account.email,
      google_id: account.google_id,
      avatar: account.avatar,
      description: account.description,
      created_at: account.created_at
    };
  }

  get(id) {
    return accounts.findOne({
      id
    });
  }

  update(id, changes) {
    const all = accounts.read();

    const index = all.findIndex(
      account => account.id === id
    );

    if (index === -1) {
      return null;
    }

    all[index] = {
      ...all[index],
      ...changes
    };

    accounts.write(all);

    return all[index];
  }
}
