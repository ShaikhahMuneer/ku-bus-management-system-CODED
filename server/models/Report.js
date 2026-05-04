const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route"
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip"
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    reportStatus: {
      type: String,
      enum: ["open", "in-review", "resolved", "rejected"],
      default: "open"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
