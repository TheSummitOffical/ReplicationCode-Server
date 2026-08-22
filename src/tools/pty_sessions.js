
import pty from "node-pty";

const sessions = new Map();

export function getPTY(session_id, cwd) {
  if (!sessions.has(session_id)) {
    const terminal = pty.spawn("/bin/sh", [], {
      name: "xterm-256color",
      cols: 120,
      rows: 30,
      cwd,
      env: {
        ...process.env,
        TERM: "xterm-256color"
      }
    });

    // Disable terminal input echo
    terminal.write("stty -echo\r");

    sessions.set(session_id, terminal);
  }

  return sessions.get(session_id);
}
