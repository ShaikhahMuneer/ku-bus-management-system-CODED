const mongoose = require("mongoose");

const busStatusUpdateSchema = new mongoose.Schema(
  {
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    currentStatus: {
      type: String,
      enum: ["available", "in-transit", "arrived", "maintenance", "inactive"],
      required: true
    },
    currentLocation: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BusStatusUpdate", busStatusUpdateSchema);
