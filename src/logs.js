const winston = require("winston");
require("winston-daily-rotate-file");

var logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    winston.format.colorize(),
    winston.format.printf(
      (info) =>
        `${info.timestamp} ${info.level}: ${JSON.stringify(info.message)}`
    )
  ),
  transports: [
    new winston.transports.Console({ json: false, timestamp: true }),
    new winston.transports.DailyRotateFile({
      filename: "logs/debug-%DATE%.log",
      json: false,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.Console({ json: false, timestamp: true }),
    new winston.transports.DailyRotateFile({
      filename: "logs/exceptions-%DATE%.log",
      json: false,
    }),
  ],
  exitOnError: false,
});

module.exports = logger;
