const mongoose = require("mongoose");
const helmet = require("helmet");
const appDebugger = require("debug")("app");
const rentals = require("./routes/rentals");
const movies = require("./routes/movies");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const express = require("express");
const app = express();

mongoose
  .connect("mongodb://localhost/vidly")
  .then(console.log("Connected to MongoDB..."))
  .catch(err => console.log("Could not connect MongoDB...."));

app.use(helmet());
app.use(express.json());
app.use("/api/rentals", rentals);
app.use("/api/movies", movies);
app.use("/api/genres", genres);
app.use("/api/customers", customers);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  appDebugger(`listen to ${port}...`);
});
