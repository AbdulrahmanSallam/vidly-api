const joi = require("joi");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

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

router.get("/", async (req, res) => {
  const customers = await Customer.find();

  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return res
      .status(404)
      .send("The customer with the given ID was not found.");
  }

  res.send(customer);
});

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.send(error.details[0].message);

  let customer = new Customer({ ...req.body });

  customer = await customer.save();

  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      $set: { ...req.body },
    },
    { new: true },
  );

  if (!customer) {
    return res
      .status(404)
      .send("The customer with the given ID was not found.");
  }

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) {
    return res
      .status(404)
      .send("The customer with the given ID was not found.");
  }

  res.send(customer);
});

function validateCustomer(customer) {
  const schema = joi.object({
    name: joi.string().required().min(5).max(255),
    phone: joi.string().required().min(11).max(20),
    isGold: joi.boolean(),
  });

  return schema.validate(customer);
}

module.exports = router;
