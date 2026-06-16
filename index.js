const mongoose = require("mongoose");
const helmet = require("helmet");
const appDebugger = require("debug")("app");
const genres = require("./routes/genres");

const express = require("express");
const app = express();

mongoose
  .connect("mongodb://localhost/vidly")
  .then(console.log("Connected to MongoDB..."))
  .catch(err => console.log("Could not connect MongoDB...."));

app.use(helmet());
app.use(express.json());
app.use("/api/genres", genres);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  appDebugger(`listen to ${port}...`);
});
