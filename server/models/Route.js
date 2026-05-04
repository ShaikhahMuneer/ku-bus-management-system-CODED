const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    routeName: {
      type: String,
      required: true,
      trim: true
    },
    routeType: {
      type: String,
      enum: ["beeyout", "campus-off", "college"],
      required: true
    },
    departureLocation: {
      type: String,
      required: true,
      trim: true
    },
    destination: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    blockStart: Number,
    blockEnd: Number,
    stops: [
      {
        name: String,
        order: Number,
        latitude: Number,
        longitude: Number
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Route", routeSchema);
