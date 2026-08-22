
import fs from "fs";
import os from "os";
import path from "path";

const CONFIG = path.join(
  os.homedir(),
  ".replication",
  "config.json"
);

export function getSession() {
  if (!fs.existsSync(CONFIG)) {
    throw new Error(
      "Not logged in. Run: replication login"
    );
  }

  return JSON.parse(
    fs.readFileSync(CONFIG, "utf8")
  );
}
