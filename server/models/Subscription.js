const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    homeLocation: {
      type: String,
      required: true
    },
    blockNumber: {
      type: String,
      required: true
    },
    pickupTimeToUniversity: String,
    pickupTimeToHome: String,
    serviceType: {
      type: String,
      enum: ["beeyout"],
      default: "beeyout"
    },
    paymentAmount: {
      type: Number,
      default: 0
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid"
    },
    subscriptionStatus: {
      type: String,
      enum: ["active", "paused", "cancelled", "expired"],
      default: "active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
