import { join, basename } from "path";
import { readFileSync, existsSync, access, constants } from "fs";
import { Consola } from "consola";

export namespace config {
  let _data: Record<string, any>;

  const log = new Consola({});

  /**
   * Loads the 'config.json' file in the project root.
   */
  export function load() {
    const path = join(process.cwd(), "config.json");
    if (!existsSync(path)) {
      log.error("Config file is missing.")
      return process.exit(1);
    }

    access(path, constants.F_OK, err => {
      if (err) {
        log.error(`Cannot read contents of "${basename(path)}"`);
        log.error(err);
      }

      return process.exit(1);
    });

    const data = readFileSync(path, "utf-8");
    try {
      _data = JSON.parse(data);
    } catch (err) {
      log.error(`Error occurred while parsing the contents of "${basename(path)}"`);
      process.exit(1);
    }
  }
}