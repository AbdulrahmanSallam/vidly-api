const config = require("config");
const logger = require("./logger");
const mongoose = require("mongoose");

module.exports = function () {
  const mongoURI = config.get("db.uri");
  mongoose.connect(mongoURI).then(() => logger.info("Connected to MongoDB..."));
};
