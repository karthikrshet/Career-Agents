type LogLevel = "info" | "warn" | "error" | "debug" | "trace";

interface LogMeta {
  requestId?: string;
  route?: string;
  latency?: number;
  provider?: string;
  [key: string]: any;
}

class Logger {
  private isProd = process.env.NODE_ENV === "production";

  private formatMessage(level: LogLevel, message: string, meta?: LogMeta) {
    const timestamp = new Date().toISOString();
    
    if (this.isProd) {
      // Structured JSON logging in production
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...meta
      });
    } else {
      // Pretty logging in development
      const colorMap: Record<LogLevel, string> = {
        trace: "\x1b[90m", // Gray
        debug: "\x1b[36m", // Cyan
        info: "\x1b[32m",  // Green
        warn: "\x1b[33m",  // Yellow
        error: "\x1b[31m", // Red
      };
      const reset = "\x1b[0m";
      const color = colorMap[level] || reset;
      const metaStr = meta && Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
      return `[${timestamp}] ${color}${level.toUpperCase()}${reset}: ${message}${metaStr}`;
    }
  }

  trace(message: string, meta?: LogMeta) {
    console.log(this.formatMessage("trace", message, meta));
  }

  debug(message: string, meta?: LogMeta) {
    console.log(this.formatMessage("debug", message, meta));
  }

  info(message: string, meta?: LogMeta) {
    console.log(this.formatMessage("info", message, meta));
  }

  warn(message: string, meta?: LogMeta) {
    console.warn(this.formatMessage("warn", message, meta));
  }

  error(message: string, meta?: LogMeta) {
    console.error(this.formatMessage("error", message, meta));
  }
}

export const logger = new Logger();
