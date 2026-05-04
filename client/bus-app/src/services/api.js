const API_BASE_URL = "https://ku-bus-management-system.onrender.com/api";

const getToken = () => localStorage.getItem("busToken");

const request = async (endpoint, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

const formatTime = (dateValue) => {
  if (!dateValue) return "--:--";

  return new Date(dateValue).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const statusToFrontend = (status, availableSeats) => {
  if (availableSeats <= 0) return "Full";
  if (status === "in-transit") return "In Transit";
  if (status === "arrived") return "Arrived";
  if (status === "pickup-complete") return "Pickup Complete";
  if (status === "completed") return "Completed";
  if (status === "cancelled") return "Cancelled";
  return "Available";
};

const statusToBackend = (status) => {
  if (status === "In Transit") return "in-transit";
  if (status === "Arrived") return "arrived";
  if (status === "Pickup Complete") return "pickup-complete";
  if (status === "Completed") return "completed";
  if (status === "Cancelled") return "cancelled";
  return "scheduled";
};

export const mapUser = (user) => ({
  ...user,
  id: user._id,
  name: user.fullName,
  universityId: user.universityId || "",
  phone: user.phone || "",
  location: [user.city, user.block ? `Block ${user.block}` : ""]
    .filter(Boolean)
    .join(", "),
});

export const mapTrip = (trip) => {
  const bus = trip.bus || {};
  const route = trip.route || {};

  const capacity = bus.capacity || trip.availableSeats || 1;

  const passengers = Math.max(
    capacity - (trip.availableSeats ?? capacity),
    trip.currentOccupancy || 0
  );

  const isBeeyout = bus.busType === "beeyout" || trip.governorate || trip.area;

  const departureLocation = isBeeyout
    ? `${trip.governorate || ""}${trip.area ? ` - ${trip.area}` : ""}`
    : route.departureLocation || "";

  const destination = isBeeyout
    ? "Kuwait University Al-Shadadiya"
    : route.destination || "";

  return {
    ...trip,
    id: trip._id,

    serviceType: bus.busType || route.routeType || "campus-off",

    serviceLabel:
      bus.busType === "beeyout" || route.routeType === "beeyout"
        ? "Beeyout"
        : bus.busType === "college" || route.routeType === "college"
        ? "Masar"
        : "Campus-Off",

    route: isBeeyout
      ? `Beeyout ${trip.area || trip.governorate || ""} to Shadadiya`
      : route.routeName || "Unknown Route",

    category: isBeeyout
      ? "Home Pickup"
      : route.routeType === "college"
      ? "Internal Shuttle"
      : route.city || "Campus Route",

    campusPath: `${departureLocation || "Departure"} → ${
      destination || "Destination"
    }`,

    departureLocation,
    destination,

    status: statusToFrontend(trip.tripStatus, trip.availableSeats),

    type: bus.genderCategory === "female-only" ? "Female Only" : "Mixed",

    departure: formatTime(trip.departureTime),
    arrival: formatTime(trip.arrivalTime),

    bus: bus.busNumber || "Bus",

    busLabel: bus.busNumber
      ? `${bus.busNumber} (${bus.busType || "Bus"})`
      : "Bus",

    passengers,
    seats: passengers,
    total: capacity,

    driverId: trip.driver?._id,

    routeType: isBeeyout
      ? "Beeyout Home Service"
      : route.routeType === "college"
      ? "College Route"
      : "Campus-Off Route",

    area: trip.area || route.departureLocation || route.city || "",

    stops: route.stops?.length
      ? route.stops.map((stop) => stop.name)
      : isBeeyout
      ? [trip.area || "Home Area", "Shadadiya Campus"]
      : [route.departureLocation || "Start", route.destination || "End"],
  };
};

export const mapReport = (report) => ({
  ...report,
  id: report._id,

  route:
    report.route?.routeName ||
    report.trip?.route?.routeName ||
    "General Report",

  text: report.description,

  status:
    report.reportStatus === "resolved"
      ? "Resolved"
      : report.reportStatus === "rejected"
      ? "Rejected"
      : "In Progress",

  date: report.createdAt
    ? report.createdAt.slice(0, 10)
    : new Date().toISOString().slice(0, 10),

  studentName: report.student?.fullName || "Student",
});

export const authApi = {
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  forgotPassword: (email) =>
    request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (payload) =>
    request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const tripsApi = {
  getAll: () => request("/trips"),

  create: (payload) =>
    request("/trips", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateStatus: (tripId, status) =>
    request(`/trips/${tripId}/status`, {
      method: "PATCH",
      body: JSON.stringify({
        status: statusToBackend(status),
      }),
    }),
};

export const bookingsApi = {
  create: (studentId, tripId) =>
    request("/bookings", {
      method: "POST",
      body: JSON.stringify({
        student: studentId,
        trip: tripId,
      }),
    }),

  checkIn: (bookingId) =>
    request(`/bookings/${bookingId}/check-in`, {
      method: "PATCH",
    }),

  cancel: (bookingId) =>
    request(`/bookings/${bookingId}/cancel`, {
      method: "PATCH",
    }),
};

export const reportsApi = {
  getAll: () => request("/reports"),

  create: (payload) =>
    request("/reports", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (reportId, payload) =>
    request(`/reports/${reportId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};

export const busesApi = {
  getAll: () => request("/buses"),

  create: (payload) =>
    request("/buses", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (busId, payload) =>
    request(`/buses/${busId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  delete: (busId) =>
    request(`/buses/${busId}`, {
      method: "DELETE",
    }),
};

export const usersApi = {
  getAll: () => request("/users"),
};

export const routesApi = {
  getAll: () => request("/routes"),

  create: (payload) =>
    request("/routes", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (routeId, payload) =>
    request(`/routes/${routeId}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  delete: (routeId) =>
    request(`/routes/${routeId}`, {
      method: "DELETE",
    }),
};


