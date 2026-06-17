const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const auth = require("../middlewares/auth");
const express = require("express");
const router = express.Router();

// GET all rentals (sorted by newest first)
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

// GET single rental
router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");
  res.send(rental);
});

// POST create rental
router.post("/", auth, async (req, res) => {
  // Validate request body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    // Find customer and movie in parallel
    const [customer, movie] = await Promise.all([
      Customer.findById(req.body.customerId),
      Movie.findById(req.body.movieId),
    ]);

    // Validate existence
    if (!customer) return res.status(404).send("Invalid customer.");
    if (!movie) return res.status(404).send("Invalid movie.");

    // Check stock availability
    if (movie.numberInStock === 0) {
      return res.status(400).send("Movie not in stock.");
    }

    // Atomically decrement stock (prevents race conditions)
    const updatedMovie = await Movie.findOneAndUpdate(
      {
        _id: movie._id,
        numberInStock: { $gt: 0 }, // Only update if stock > 0
      },
      { $inc: { numberInStock: -1 } },
      { new: true },
    );

    // Double-check stock was available
    if (!updatedMovie) {
      return res.status(400).send("Movie is no longer in stock.");
    }

    // Create rental
    const rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        isGold: customer.isGold,
        phone: customer.phone,
      },
      movie: {
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      },
    });

    await rental.save();
    res.status(201).send(rental);
  } catch (error) {
    console.error("Rental creation error:", error.message);
    res.status(500).send("An error occurred while creating the rental.");
  }
});

// DELETE rental
router.delete("/:id", [auth], async (req, res) => {
  const rental = await Rental.findByIdAndDelete(req.params.id);
  if (!rental) {
    return res.status(404).send("The rental with the given ID was not found.");
  }
  res.send(rental);
});

// PUT return rental (optional - add this for returning movies)
router.put("/:id/return", auth, async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) {
    return res.status(404).send("Rental not found.");
  }

  if (rental.dateReturned) {
    return res.status(400).send("Rental already returned.");
  }

  // Calculate rental fee
  const daysRented = Math.ceil(
    (Date.now() - rental.dateOut) / (1000 * 60 * 60 * 24),
  );
  const rentalFee = daysRented * rental.movie.dailyRentalRate;

  // Update rental
  rental.dateReturned = Date.now();
  rental.rentalFee = rentalFee;
  await rental.save();

  // Increment movie stock
  await Movie.findByIdAndUpdate(rental.movie._id, {
    $inc: { numberInStock: 1 },
  });

  res.send(rental);
});

module.exports = router;
