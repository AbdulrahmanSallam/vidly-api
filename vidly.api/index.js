const express = require("express");
const Joi = require("joi");

const app = express();

app.use(express.json());

const genres = [
  {
    id: 1,
    name: "Action",
  },
  {
    id: 2,
    name: "Comedy",
  },
  {
    id: 3,
    name: "Fantasia",
  },
];

app.get("/genres", (req, res) => {
  res.send(genres);
  res.end();
});

app.post("/genres", (req, res) => {
  // validate
  const { error } = validateGenre(req.body);
  if (error) return res.send(error.details[0].message);

  // process
  const newGenre = {
    id: genres.length + 1,
    name: req.body.name,
  };
  genres.push(newGenre);

  res.send(newGenre);
});

app.put("/genres/:id", (req, res) => {
  // validate
  const genre = genres.find(genre => genre.id == req.params.id);

  if (!genre) {
    res.status(404).send("The genre with the given ID was not found.");
    return;
  }

  const { error } = validateGenre(req.body);
  if (error) return res.send(error.details[0].message);

  // proccess

  genre.name = req.body.name;

  res.send(genre);
});

app.delete("/genres/:id", (req, res) => {
  const genre = genres.find(genre => genre.id == req.params.id);

  if (!genre) {
    return res.status(404).send("The genre with the given ID was not found.");
  }

  const index = genres.indexOf(genre);
  genres.splice(index, 1);

  res.send(genre);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listen to ${port}`);
});

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
  });

  return schema.validate(genre);
}
