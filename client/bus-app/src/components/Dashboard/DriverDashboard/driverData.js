export const driverTrips = [
  {
    id: 1,
    route: "Shuwaikh → Al-Shadadiya",
    area: "College of Social Sciences - Shuwaikh Area",
    time: "08:00",
    arrival: "08:30",
    passengers: 15,
    capacity: 40,
    bus: "BUS-003",
    status: "Available",
    routeType: "Beeyout",
    stops: [
      "Shuwaikh - Social Sciences",
      "Kuwait Highway",
      "Al-Shadadiya Gate",
      "Main Campus",
    ],
  },

  {
    id: 2,
    route: "Jabriya → Al-Shadadiya",
    area: "College of Medicine - Jabriya Area",
    time: "09:00",
    arrival: "09:25",
    passengers: 20,
    capacity: 40,
    bus: "BUS-004",
    status: "Available",
    routeType: "Campus-Off Route",
    stops: [
      "Jabriya - Medicine",
      "Medical Complex",
      "Al-Shadadiya Gate",
      "Main Campus",
    ],
  },

  {
    id: 3,
    route: " Adailiya → Al-Shadadiya",
    area: "College of Architecture - Adailiya Area",
    time: "07:30",
    arrival: "08:00",
    passengers: 35,
    capacity: 50,
    bus: "BUS-005",
    status: "In Transit",
    routeType: " Campus-Off Route",
    stops: [
      "Adailiya - Architecture",
      "Gulf Road",
      "Al-Shadadiya Gate",
      "Main Campus",
    ],
  },
];

export const pickupStudents = [
  {
    id: 1,
    name: "Sarah Ahmed",
    location: "Block 3",
    status: "Pending",
  },
  {
    id: 2,
    name: "Mariam Ali",
    location: "Block 5",
    status: "Picked Up",
  },
  {
    id: 3,
    name: "Noor Khaled",
    location: "Block 7",
    status: "Pending",
  },
];
