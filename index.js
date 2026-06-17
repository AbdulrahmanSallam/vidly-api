const config = require("config");
const logger = require("./startup/logger");
const express = require("express");
const app = express();

require("./startup/validation")();
require("./startup/prod")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

const port = config.get("port");
const server = app.listen(port, () => {
  logger.info(`listen to ${port}...`);
});

module.exports = server;
