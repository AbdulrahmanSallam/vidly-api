const helmet = require("helmet");
const appDebugger = require("debug")("app");
const Joi = require("joi");
const genres = require("./routes/genres");
const express = require("express");
const app = express();

app.use(helmet);
app.use(express.json());
app.use("/api/genres", genres);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  appDebugger(`listen to ${port}...`);
});
