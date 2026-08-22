
import pty from "node-pty";

export function runPTY({
  cwd,
  onData,
  onExit
}) {
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

  terminal.onData((data) => {
    if (onData) {
      onData(data);
    }
  });

  terminal.onExit((event) => {
    if (onExit) {
      onExit(event);
    }
  });

  return {
    write(input) {
      terminal.write(input);
    },

    resize(cols, rows) {
      terminal.resize(cols, rows);
    },

    kill() {
      terminal.kill();
    }
  };
}
