const Booking = require("../models/Booking");
const Trip = require("../models/Trip");

const bookingPopulate = [
  { path: "student", select: "-password" },
  {
    path: "trip",
    populate: [
      { path: "bus" },
      { path: "driver", select: "-password" },
      { path: "route" }
    ]
  }
];

const getBookings = async (req, res) => {
  try {
    let query = Booking.find();

    bookingPopulate.forEach((option) => {
      query = query.populate(option);
    });

    const bookings = await query.sort("-createdAt");

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getStudentBookings = async (req, res) => {
  try {
    let query = Booking.find({ student: req.params.studentId });

    bookingPopulate.forEach((option) => {
      query = query.populate(option);
    });

    const bookings = await query.sort("-createdAt");

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createBooking = async (req, res) => {
  try {
    const { student, trip } = req.body;

    const selectedTrip = await Trip.findById(trip);

    if (!selectedTrip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found."
      });
    }

    if (selectedTrip.availableSeats <= 0) {
      return res.status(400).json({
        success: false,
        message: "No available seats for this trip."
      });
    }

    const booking = await Booking.create({
      student,
      trip,
      qrCodeValue: `BOOKING-${student}-${trip}-${Date.now()}`
    });

    selectedTrip.availableSeats -= 1;
    await selectedTrip.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("student", "-password")
      .populate({
        path: "trip",
        populate: [{ path: "bus" }, { path: "driver", select: "-password" }, { path: "route" }]
      });

    res.status(201).json({
      success: true,
      data: populatedBooking
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Student already booked this trip."
      });
    }

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const checkInBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    if (booking.checkInStatus === "checked-in") {
      return res.status(400).json({
        success: false,
        message: "Student is already checked in."
      });
    }

    booking.checkInStatus = "checked-in";
    booking.checkInTime = new Date();
    await booking.save();

    await Trip.findByIdAndUpdate(booking.trip, {
      $inc: { currentOccupancy: 1 }
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("student", "-password")
      .populate({
        path: "trip",
        populate: [{ path: "bus" }, { path: "driver", select: "-password" }, { path: "route" }]
      });

    res.json({
      success: true,
      data: populatedBooking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const checkOutBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    if (booking.checkInStatus !== "checked-in") {
      return res.status(400).json({
        success: false,
        message: "Student must be checked in before checking out."
      });
    }

    booking.checkInStatus = "checked-out";
    booking.checkOutTime = new Date();
    booking.bookingStatus = "completed";
    await booking.save();

    await Trip.findByIdAndUpdate(booking.trip, {
      $inc: { currentOccupancy: -1 }
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("student", "-password")
      .populate({
        path: "trip",
        populate: [{ path: "bus" }, { path: "driver", select: "-password" }, { path: "route" }]
      });

    res.json({
      success: true,
      data: populatedBooking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    if (booking.bookingStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking is already cancelled."
      });
    }

    booking.bookingStatus = "cancelled";
    await booking.save();

    await Trip.findByIdAndUpdate(booking.trip, {
      $inc: { availableSeats: 1 }
    });

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getBookings,
  getStudentBookings,
  createBooking,
  checkInBooking,
  checkOutBooking,
  cancelBooking
};
