const { Customer, validate } = require("../models/customer");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

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

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.send(error.details[0].message);

  let customer = new Customer({ ...req.body });

  customer = await customer.save();

  res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
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

router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) {
    return res
      .status(404)
      .send("The customer with the given ID was not found.");
  }

  res.send(customer);
});

module.exports = router;
