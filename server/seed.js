const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const connectDB = require("./config/db");

const User = require("./models/User");
const Bus = require("./models/Bus");
const Route = require("./models/Route");
const Trip = require("./models/Trip");
const Booking = require("./models/Booking");
const Report = require("./models/Report");
const DemandRequest = require("./models/DemandRequest");
const Subscription = require("./models/Subscription");
const Notification = require("./models/Notification");
const BusStatusUpdate = require("./models/BusStatusUpdate");

const seedDatabase = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany(),
      Bus.deleteMany(),
      Route.deleteMany(),
      Trip.deleteMany(),
      Booking.deleteMany(),
      Report.deleteMany(),
      DemandRequest.deleteMany(),
      Subscription.deleteMany(),
      Notification.deleteMany(),
      BusStatusUpdate.deleteMany()
    ]);

    const users = await User.create([
      {
        fullName: "Admin User",
        email: "admin@ku.edu.kw",
        phone: "90000001",
        password: "123456",
        role: "admin",
        universityId: "ADM001",
        gender: "female"
      },
      {
        fullName: "Fatima Driver",
        email: "driver1@ku.edu.kw",
        phone: "90000002",
        password: "123456",
        role: "driver",
        universityId: "DRV001",
        gender: "female",
        city: "Salmiya",
        block: "5"
      },
      {
        fullName: "Hana Student",
        email: "student1@ku.edu.kw",
        phone: "90000003",
        password: "123456",
        role: "student",
        universityId: "20260001",
        gender: "female",
        city: "Salmiya",
        block: "5"
      },
      {
        fullName: "Sara Student",
        email: "student2@ku.edu.kw",
        phone: "90000004",
        password: "123456",
        role: "student",
        universityId: "20260002",
        gender: "female",
        city: "Jabriya",
        block: "3"
      }
    ]);

    const admin = users[0];
    const driver = users[1];
    const student = users[2];

    const buses = await Bus.create([
      {
        busNumber: "BEE-101",
        capacity: 30,
        busType: "beeyout",
        genderCategory: "female-only",
        status: "assigned"
      },
      {
        busNumber: "COF-201",
        capacity: 40,
        busType: "campus-off",
        genderCategory: "mixed",
        status: "assigned"
      },
      {
        busNumber: "COL-301",
        capacity: 25,
        busType: "college",
        genderCategory: "mixed",
        status: "assigned"
      }
    ]);
const collegeLocations = [
  "College of Engineering and Petroleum",
  "College of Science - North",
  "College of Science - South",
  "College of Life Sciences - North",
  "College of Life Sciences - South",
  "College of Education - North",
  "College of Education - South",
  "College of Arts - North",
  "College of Arts - South",
  "College of Business Administration - North",
  "College of Business Administration - South",
  "College of Sharia and Islamic Studies - North",
  "College of Sharia and Islamic Studies - South"
];

const collegeRoutes = [];

for (let i = 0; i < collegeLocations.length; i++) {
  for (let j = 0; j < collegeLocations.length; j++) {
    if (i !== j) {
      collegeRoutes.push({
        routeName: `${collegeLocations[i]} to ${collegeLocations[j]}`,
        routeType: "college",
        departureLocation: collegeLocations[i],
        destination: collegeLocations[j],
        city: "Shadadiya",
        blockStart: 0,
        blockEnd: 0
      });
    }
  }
}
    const routes = await Route.create([
  {
    routeName: "Beeyout Salmiya to Shadadiya",
    routeType: "beeyout",
    departureLocation: "Salmiya Block 5",
    destination: "Kuwait University - Shadadiya",
    city: "Salmiya",
    blockStart: 1,
    blockEnd: 12
  },
  {
    routeName: "Jabriya to College of Medicine",
    routeType: "campus-off",
    departureLocation: "Jabriya",
    destination: "College of Medicine",
    city: "Jabriya",
    blockStart: 1,
    blockEnd: 8
  },

  ...collegeRoutes
]);

    const now = new Date();
    const tomorrowMorning = new Date(now);
    tomorrowMorning.setDate(now.getDate() + 1);
    tomorrowMorning.setHours(7, 30, 0, 0);

    const tomorrowReturn = new Date(now);
    tomorrowReturn.setDate(now.getDate() + 1);
    tomorrowReturn.setHours(14, 30, 0, 0);

    const trips = await Trip.create([
      {
        bus: buses[0]._id,
        driver: driver._id,
        route: routes[0]._id,
        departureTime: tomorrowMorning,
        arrivalTime: new Date(tomorrowMorning.getTime() + 60 * 60 * 1000),
        tripStatus: "scheduled",
        availableSeats: 30,
        currentOccupancy: 0
      },
      {
        bus: buses[1]._id,
        driver: driver._id,
        route: routes[1]._id,
        departureTime: tomorrowMorning,
        arrivalTime: new Date(tomorrowMorning.getTime() + 45 * 60 * 1000),
        tripStatus: "scheduled",
        availableSeats: 40,
        currentOccupancy: 0
      },
      {
        bus: buses[2]._id,
        driver: driver._id,
        route: routes[2]._id,
        departureTime: tomorrowReturn,
        arrivalTime: new Date(tomorrowReturn.getTime() + 20 * 60 * 1000),
        tripStatus: "scheduled",
        availableSeats: 25,
        currentOccupancy: 0
      }
    ]);

    await Subscription.create({
      student: student._id,
      homeLocation: "Salmiya",
      blockNumber: "5",
      pickupTimeToUniversity: "7:30 AM",
      pickupTimeToHome: "2:30 PM",
      serviceType: "beeyout",
      paymentAmount: 20,
      paymentStatus: "paid",
      subscriptionStatus: "active"
    });

    await Notification.create({
      sender: admin._id,
      receiver: student._id,
      message: "Welcome to the University Bus Management System.",
      notificationType: "system"
    });

    console.log("Database seeded successfully.");
    console.log("Login accounts:");
    console.log("admin@ku.edu.kw / 123456");
    console.log("driver1@ku.edu.kw / 123456");
    console.log("student1@ku.edu.kw / 123456");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
