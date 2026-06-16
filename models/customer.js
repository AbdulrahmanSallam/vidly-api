const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      minlength: 11,
      maxlength: 20,
      trim: true,
    },
    isGold: {
      type: Boolean,
      required: true,
    },
  }),
);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().required().min(5).max(255),
    phone: Joi.string().required().min(11).max(20),
    isGold: Joi.boolean(),
  });

  return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
