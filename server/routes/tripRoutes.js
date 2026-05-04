const express = require("express");
const {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  updateTripStatus,
  markArrived,
  markPickupComplete,
  completeTrip
} = require("../controllers/tripController");

const router = express.Router();

router.route("/")
  .get(getTrips)
  .post(createTrip);

router.route("/:id")
  .get(getTripById)
  .patch(updateTrip);

router.patch("/:id/status", updateTripStatus);
router.patch("/:id/mark-arrived", markArrived);
router.patch("/:id/mark-pickup-complete", markPickupComplete);
router.patch("/:id/complete", completeTrip);

module.exports = router;
