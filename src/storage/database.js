import fs from "fs";
import path from "path";

const DATA_DIR = path.resolve("data");

export class Database {
  constructor(name) {
    this.file = path.join(
      DATA_DIR,
      `${name}.json`
    );

    fs.mkdirSync(
      DATA_DIR,
      { recursive: true }
    );

    if (!fs.existsSync(this.file)) {
      fs.writeFileSync(
        this.file,
        "[]"
      );
    }
  }

  read() {
    return JSON.parse(
      fs.readFileSync(
        this.file,
        "utf8"
      )
    );
  }

  write(data) {
    fs.writeFileSync(
      this.file,
      JSON.stringify(
        data,
        null,
        2
      )
    );
  }

  insert(item) {
    const data = this.read();

    data.push(item);

    this.write(data);

    return item;
  }

  find(query) {
    return this.read().filter(
      item =>
        Object.keys(query)
          .every(
            key =>
              item[key] === query[key]
          )
    );
  }

  findOne(query) {
    return this.find(query)[0];
  }

  remove(query) {
    const data = this.read()
      .filter(
        item =>
          !Object.keys(query)
            .every(
              key =>
                item[key] === query[key]
            )
      );

    this.write(data);
  }
}
