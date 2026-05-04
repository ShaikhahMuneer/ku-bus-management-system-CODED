const express = require("express");
const {
  getBookings,
  getStudentBookings,
  createBooking,
  checkInBooking,
  checkOutBooking,
  cancelBooking
} = require("../controllers/bookingController");

const router = express.Router();

router.route("/")
  .get(getBookings)
  .post(createBooking);

router.get("/student/:studentId", getStudentBookings);
router.patch("/:id/check-in", checkInBooking);
router.patch("/:id/check-out", checkOutBooking);
router.patch("/:id/cancel", cancelBooking);

module.exports = router;
