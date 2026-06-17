const winston = require("winston");
require("winston-mongodb");

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  ),
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [consoleTransport],
  exceptionHandlers: [consoleTransport],
  rejectionHandlers: [consoleTransport],
  exitOnError: false,
});

try {
  const dbUri = process.env.MONGODB_URI;
  if (dbUri) {
    logger.add(
      new winston.transports.MongoDB({
        db: dbUri,
        collection: "logs",
        level: "error",
        handleExceptions: true,
        handleRejections: true,
      }),
    );
  }
} catch (error) {
  console.warn("MongoDB logging transport not available");
}

module.exports = logger;
