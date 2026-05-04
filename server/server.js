const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const createCrudRouter = require("./routes/crudRoute");

const User = require("./models/User");
const Bus = require("./models/Bus");
const Route = require("./models/Route");
const Report = require("./models/Report");
const DemandRequest = require("./models/DemandRequest");
const Subscription = require("./models/Subscription");
const Notification = require("./models/Notification");
const BusStatusUpdate = require("./models/BusStatusUpdate");

const app = express();

connectDB();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://ku-bus-management-system.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    return callback(new Error("CORS not allowed"));
  },
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "University Bus Management System API is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/bookings", bookingRoutes);

app.use("/api/users", createCrudRouter(User));
app.use("/api/buses", createCrudRouter(Bus));
app.use("/api/routes", createCrudRouter(Route));
app.use("/api/reports", createCrudRouter(Report, [
  { path: "student", select: "-password" },
  { path: "route" },
  { path: "trip" }
]));
app.use("/api/demand-requests", createCrudRouter(DemandRequest, [
  { path: "student", select: "-password" },
  { path: "trip" }
]));
app.use("/api/subscriptions", createCrudRouter(Subscription, [
  { path: "student", select: "-password" }
]));
app.use("/api/notifications", createCrudRouter(Notification, [
  { path: "sender", select: "-password" },
  { path: "receiver", select: "-password" }
]));
app.use("/api/bus-status-updates", createCrudRouter(BusStatusUpdate, [
  { path: "bus" },
  { path: "driver", select: "-password" }
]));

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

app.use((error, req, res, next) => {
  res.status(500).json({
    success: false,
    message: error.message || "Server error"
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
