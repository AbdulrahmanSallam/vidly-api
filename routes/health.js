const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    // Check database connection if using MongoDB
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        status: "error",
        database: "disconnected",
        timestamp: new Date().toISOString(),
      });
    }

    res.status(200).json({
      status: "OK",
      database: "connected",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: {
        heapUsed:
          Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB",
        heapTotal:
          Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + " MB",
      },
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
