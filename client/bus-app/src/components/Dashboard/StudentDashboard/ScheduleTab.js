import React, { useState } from "react";
import { Filter } from "lucide-react";
import CategoryDropdown from "./CategoryDropdown";

const locations = [
  "All Locations",
  "College of Social Sciences - Shuwaikh Area",
  "Al-Shadadiya Main Campus",
  "College of Medicine - Jabriya Area",
  "College of Architecture - Adailiya Area",
  "College of Marine Sciences - Fintas Area",
  "North Campus - Engineering & Petroleum",
  "South Campus - Engineering & Petroleum",
  "North Campus - Science",
  "South Campus - Science",
  "North Campus - Life Sciences",
  "South Campus - Life Sciences",
  "North Campus - Business Administration",
  "South Campus - Business Administration",
  "North Campus - Law",
  "South Campus - Law",
  "North Campus - Education",
  "South Campus - Education",
  "North Campus - Sharia & Islamic Studies",
  "South Campus - Sharia & Islamic Studies",
  "North Campus - Arts",
  "South Campus - Arts",
  "Hawalli City (Home)",
  "Kuwait University Main Campus",
  "Salmiya City (Home)",
  "Farwaniya City (Home)",
  "Jahra City (Home)",
];

function ScheduleCard({ trip, isBoarded, onCheckIn }) {
  const percent = Math.round((trip.seats / trip.total) * 100);

  return (
    <div
      className={`schedule-card ${
        trip.status === "In Transit" ? "yellow-border" : "green-border"
      }`}
    >
      <div className="schedule-main">
        <div className="schedule-info">
          <div className="row-wrap">
            <h3>{trip.route}</h3>

            <span
              className={`mini-badge ${
                trip.status === "Available" ? "badge-green" : "badge-yellow"
              }`}
            >
              {trip.status}
            </span>

            <span className="mini-badge badge-blue">{trip.type}</span>
          </div>

          <p>Category of Route: {trip.category}</p>
          <p>{trip.campusPath}</p>
          <p>
            {trip.seats} of {trip.total} seats
          </p>
        </div>

        <div className="schedule-side">
          <p>
            🕒 {trip.departure} - {trip.arrival}
          </p>

          <p>🚌 {trip.serviceLabel}</p>

          <button className="purple-btn" onClick={onCheckIn}>
            {isBoarded ? "Cancel Boarding" : "Check-In"}
          </button>
        </div>
      </div>

      <div className="progress-line">
        <div style={{ width: `${percent}%` }}></div>
      </div>

      <div className="progress-percent">{percent}%</div>
    </div>
  );
}

function ScheduleTab({ user, trips, studentTripStatus, onTripCheckIn }) {
  const [selectedCategory, setSelectedCategory] = useState("campus-off");
  const [departureLocation, setDepartureLocation] = useState("All Locations");
  const [destination, setDestination] = useState("All Locations");

  const filteredTrips = trips.filter((trip) => {
    const matchCategory = trip.serviceType === selectedCategory;

    const matchDeparture =
      departureLocation === "All Locations" ||
      trip.departureLocation === departureLocation;

    const matchDestination =
      destination === "All Locations" || trip.destination === destination;

    return matchCategory && matchDeparture && matchDestination;
  });

  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h2>Bus Schedules</h2>
          <p>Track and book your rides</p>
        </div>
      </div>

      <div className="filter-box">
        <CategoryDropdown
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>

      <div className="search-filter-box">
        <div className="search-filter-title">
          <Filter size={18} />
          <h3>Search Filters</h3>
        </div>

        <div className="search-filter-row">
          <div className="search-field">
            <label>Departure Location</label>
            <select
              value={departureLocation}
              onChange={(e) => setDepartureLocation(e.target.value)}
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div className="search-field">
            <label>Destination</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredTrips.length === 0 ? (
        <div className="empty-routes">
          No trips found for the selected filters.
        </div>
      ) : (
        filteredTrips.map((trip) => (
          <ScheduleCard
            key={trip.id}
            trip={{ ...trip, seats: trip.passengers }}
            isBoarded={studentTripStatus[`${user.id}-${trip.id}`] === "boarded"}
            onCheckIn={() => onTripCheckIn(trip.id)}
          />
        ))
      )}
    </section>
  );
}

export default ScheduleTab;
