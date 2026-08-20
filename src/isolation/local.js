export class LocalIsolation {

  constructor() {
    this.sandboxes = new Map();
  }


  create(config) {
    const id =
      crypto.randomUUID();

    this.sandboxes.set(
      id,
      {
        id,
        config,
        status: "created"
      }
    );

    return {
      id
    };
  }


  destroy(id) {
    this.sandboxes.delete(
      id
    );
  }


  exec(id, command, args) {

    const sandbox =
      this.sandboxes.get(id);

    if (!sandbox) {
      throw new Error(
        "Sandbox missing"
      );
    }

    sandbox.status = "running";

    return {
      command,
      args
    };
  }


  status(id) {
    return this.sandboxes.get(id);
  }


  logs(id) {
    return [];
  }
}
