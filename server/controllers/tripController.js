const Trip = require("../models/Trip");
const Bus = require("../models/Bus");
const BusStatusUpdate = require("../models/BusStatusUpdate");

const tripPopulate = [
  { path: "bus" },
  { path: "driver", select: "-password" },
  { path: "route" },
];

const getTrips = async (req, res) => {
  try {
    const filter = {};

    if (req.query.status) {
      filter.tripStatus = req.query.status;
    }

    if (req.query.driver) {
      filter.driver = req.query.driver;
    }

    let query = Trip.find(filter);

    tripPopulate.forEach((option) => {
      query = query.populate(option);
    });

    const trips = await query.sort("departureTime");

    res.json({
      success: true,
      count: trips.length,
      data: trips,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTripById = async (req, res) => {
  try {
    let query = Trip.findById(req.params.id);

    tripPopulate.forEach((option) => {
      query = query.populate(option);
    });

    const trip = await query;

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createTrip = async (req, res) => {
  try {
    const {
      bus,
      driver,
      route,
      governorate,
      area,
      departureTime,
      arrivalTime,
      availableSeats,
      tripStatus,
      currentOccupancy,
    } = req.body;

    if (!bus || !driver || !departureTime || !arrivalTime) {
      return res.status(400).json({
        success: false,
        message: "Bus, driver, departure time, and arrival time are required.",
      });
    }

    const selectedBus = await Bus.findById(bus);

    if (!selectedBus) {
      return res.status(404).json({
        success: false,
        message: "Selected bus not found.",
      });
    }

    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);

    if (arrival <= departure) {
      return res.status(400).json({
        success: false,
        message: "Arrival time must be after departure time.",
      });
    }

    if (selectedBus.busType === "beeyout") {
      if (!governorate || !area) {
        return res.status(400).json({
          success: false,
          message: "Beeyout trips require governorate and area.",
        });
      }
    } else {
      if (!route) {
        return res.status(400).json({
          success: false,
          message: "Campus-Off and College trips require a route.",
        });
      }
    }

    const trip = await Trip.create({
      bus,
      driver,
      route: selectedBus.busType === "beeyout" ? null : route,
      governorate: selectedBus.busType === "beeyout" ? governorate : null,
      area: selectedBus.busType === "beeyout" ? area : null,
      departureTime,
      arrivalTime,
      availableSeats: Number(availableSeats || selectedBus.capacity),
      currentOccupancy: Number(currentOccupancy || 0),
      tripStatus: tripStatus || "scheduled",
    });

    const populatedTrip = await Trip.findById(trip._id)
      .populate("bus")
      .populate("driver", "-password")
      .populate("route");

    res.status(201).json({
      success: true,
      data: populatedTrip,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("bus")
      .populate("driver", "-password")
      .populate("route");

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTripStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "scheduled",
      "in-transit",
      "arrived",
      "pickup-complete",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid trip status.",
      });
    }

    const updateData = { tripStatus: status };

    if (status === "arrived") updateData.arrivedAt = new Date();
    if (status === "pickup-complete") updateData.pickupCompletedAt = new Date();
    if (status === "completed") updateData.completedAt = new Date();

    const trip = await Trip.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("bus")
      .populate("driver", "-password")
      .populate("route");

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found.",
      });
    }

    if (trip.bus && trip.driver) {
      await BusStatusUpdate.create({
        bus: trip.bus._id,
        driver: trip.driver._id,
        currentStatus: status === "completed" ? "available" : status,
        currentLocation:
          trip.route?.destination ||
          trip.area ||
          trip.governorate ||
          "Trip location",
      });
    }

    res.json({
      success: true,
      data: trip,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const markArrived = async (req, res) => {
  req.body.status = "arrived";
  return updateTripStatus(req, res);
};

const markPickupComplete = async (req, res) => {
  req.body.status = "pickup-complete";
  return updateTripStatus(req, res);
};

const completeTrip = async (req, res) => {
  req.body.status = "completed";
  return updateTripStatus(req, res);
};

module.exports = {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  updateTripStatus,
  markArrived,
  markPickupComplete,
  completeTrip,
};
