import { format } from "ansikit";

export class Logger {
  /**
   * the name of this logger.
   */
  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  write(level: LogLevel, content: string) {
    let method = 
    if (level )
  }
}

type LogLevel = "info" | "debug" | "error" | "warn";
