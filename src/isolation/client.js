export class IsolationClient {

  constructor(provider) {
    this.provider = provider;
  }


  createSandbox(config) {
    return this.provider.create(
      config
    );
  }


  destroySandbox(id) {
    return this.provider.destroy(
      id
    );
  }


  exec(id, command, args = []) {
    return this.provider.exec(
      id,
      command,
      args
    );
  }


  logs(id) {
    return this.provider.logs(
      id
    );
  }


  status(id) {
    return this.provider.status(
      id
    );
  }
}
