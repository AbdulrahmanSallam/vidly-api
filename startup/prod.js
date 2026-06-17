const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const forceHttps = require("../middlewares/forceHttps");

module.exports = function (app) {
  app.set("trust proxy", 1);
  app.use(cors());

  if (process.env.NODE_ENV === "production") {
    app.use(forceHttps);
  }

  app.use(helmet());
  app.use(compression());
  app.use(express.json());
};
