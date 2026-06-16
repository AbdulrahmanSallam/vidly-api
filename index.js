const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const helmet = require("helmet");
const appDebugger = require("debug")("app");
const auth = require("./routes/auth");
const users = require("./routes/users");
const rentals = require("./routes/rentals");
const movies = require("./routes/movies");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const express = require("express");
const app = express();

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwt private key is not defined");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/vidly")
  .then(console.log("Connected to MongoDB..."))
  .catch(err => console.log("Could not connect MongoDB...."));

app.use(helmet());
app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/rentals", rentals);
app.use("/api/movies", movies);
app.use("/api/genres", genres);
app.use("/api/customers", customers);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  appDebugger(`listen to ${port}...`);
});
