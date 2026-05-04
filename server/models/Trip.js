const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      default: null,
    },

    governorate: {
      type: String,
      default: null,
    },

    area: {
      type: String,
      default: null,
    },

    departureTime: {
      type: Date,
      required: true,
    },

    arrivalTime: {
      type: Date,
      required: true,
    },

    tripStatus: {
      type: String,
      enum: [
        "scheduled",
        "in-transit",
        "arrived",
        "pickup-complete",
        "completed",
        "cancelled",
      ],
      default: "scheduled",
    },

    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },

    currentOccupancy: {
      type: Number,
      default: 0,
      min: 0,
    },

    arrivedAt: Date,
    pickupCompletedAt: Date,
    completedAt: Date,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", tripSchema);