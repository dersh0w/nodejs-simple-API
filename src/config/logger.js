require("dotenv").config();
const winston = require("winston");
const { format } = require("winston");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || "http",
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: "DD/MM/YYYY HH:mm:ss" }),
        format.printf(
          (info) => `[${info.timestamp}] [${info.level}]: ${info.message}`
        )
      ),
    }),
    new winston.transports.File({
      level: "error",
      filename: "logs/error.log",
    }),
  ],
});

module.exports = logger;
