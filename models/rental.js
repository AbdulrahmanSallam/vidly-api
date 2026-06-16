const Joi = require("joi");
const mongoose = require("mongoose");

const Rental = mongoose.model(
  "rental",
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 3,
          maxlength: 255,
          trim: true,
        },
        phone: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
          trim: true,
        },
        isGold: {
          type: Boolean,
          required: true,
        },
      }),
      required: true,
    },
    movie: {
      type: new mongoose.Schema({
        title: { type: String, minlength: 3, maxlength: 255, required: true },
        dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
      }),
      required: true,
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  }),
);

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
    dateReturned: Joi.date(),
    rentalFee: Joi.number(),
  });

  return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;
