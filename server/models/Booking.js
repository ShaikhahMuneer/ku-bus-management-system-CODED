const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true
    },
    bookingStatus: {
      type: String,
      enum: ["booked", "cancelled", "completed"],
      default: "booked"
    },
    checkInStatus: {
      type: String,
      enum: ["not-checked-in", "checked-in", "checked-out"],
      default: "not-checked-in"
    },
    checkInTime: Date,
    checkOutTime: Date,
    qrCodeValue: String
  },
  { timestamps: true }
);

bookingSchema.index({ student: 1, trip: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);
