const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    capacity: {
      type: Number,
      required: true,
      min: 1
    },
    busType: {
      type: String,
      enum: ["beeyout", "campus-off", "college"],
      required: true
    },
    genderCategory: {
      type: String,
      enum: ["female-only", "mixed"],
      default: "mixed"
    },
    status: {
      type: String,
      enum: ["available", "assigned", "maintenance", "inactive"],
      default: "available"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bus", busSchema);
