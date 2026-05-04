import React from "react";
import { MapPin, Clock3, Users, Play } from "lucide-react";

function TripCard({ trip, current = false, onChangeStatus }) {
  const percent = Math.round((trip.passengers / trip.total) * 100);

  const statusClass =
    trip.status === "In Transit"
      ? "driver-status-transit"
      : trip.status === "Full"
        ? "driver-status-full"
        : "driver-status-available";

  return (
    <div className={`driver-trip-card-new ${statusClass}`}>
      <div className="driver-title-row">
        <h3>{trip.route}</h3>
        <span className={`driver-mini-badge ${statusClass}`}>
          {trip.status}
        </span>
        <span className="driver-route-badge">🚌 {trip.routeType}</span>
      </div>

      <div className="driver-trip-body">
        <div className="driver-detail">
          <div className="driver-detail-icon blue-icon">
            <MapPin size={18} />
          </div>
          <div>
            <small>Route</small>
            <strong>{trip.area}</strong>
            <p>→ Al-Shadadiya Main Campus</p>
          </div>
        </div>

        <div className="driver-detail">
          <div className="driver-detail-icon purple-icon">
            <Clock3 size={18} />
          </div>
          <div>
            <small>Schedule</small>
            <strong>{trip.departure}</strong>
            <p>Arrives {trip.arrival}</p>
          </div>
        </div>

        <div className="driver-detail">
          <div className="driver-detail-icon green-icon">
            <Users size={18} />
          </div>
          <div>
            <small>Passengers</small>
            <strong>
              {trip.passengers}/{trip.total}
            </strong>
            <p>Bus {trip.busLabel || trip.bus}</p>
          </div>
        </div>

        {current && (
          <div className="driver-actions-new">
            <div className="status-buttons">
              <button
                type="button"
                onClick={() => onChangeStatus("Available")}
                className={
                  trip.status === "Available" ? "active-available" : ""
                }
              >
                Available
              </button>

              <button
                type="button"
                onClick={() => onChangeStatus("Full")}
                className={trip.status === "Full" ? "active-full" : ""}
              >
                Full
              </button>

              <button
                type="button"
                onClick={() => onChangeStatus("In Transit")}
                className={trip.status === "In Transit" ? "active-transit" : ""}
              >
                Transit
              </button>
            </div>

            <button
              type="button"
              className="start-trip-btn-new"
              onClick={() => onChangeStatus("In Transit")}
            >
              <Play size={15} />
              Start Trip
            </button>
          </div>
        )}
      </div>

      <div className="bus-occupancy-row">
        <span>Bus Occupancy</span>
        <strong>{percent}%</strong>
      </div>

      <div className="driver-progress-line">
        <div style={{ width: `${percent}%` }}></div>
      </div>

      <div className="route-stops-box">
        <small>ROUTE STOPS</small>
        <div className="route-stops-list">
          {trip.stops.map((stop, index) => (
            <React.Fragment key={stop}>
              <span>{stop}</span>
              {index !== trip.stops.length - 1 && <b>→</b>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function AssignedTripsSection({ trips, updateTripStatus }) {
  const currentTrip = trips[0];
  const upcomingTrips = trips.slice(1);

  if (!currentTrip) {
    return <section className="section-card"><h2>My Assigned Trips</h2><div className="empty-routes">No assigned trips for this driver.</div></section>;
  }

  return (
    <section className="section-card">
      <div className="section-header"><div><h2>My Assigned Trips</h2><p>Manage your routes and update trip statuses</p></div></div>
      <h3 className="driver-section-title">Current Trip</h3>
      <TripCard trip={currentTrip} current onChangeStatus={(status) => updateTripStatus(currentTrip.id, status)} />
      <h3 className="driver-section-title">Upcoming Trips</h3>
      {upcomingTrips.map((trip) => <TripCard key={trip.id} trip={trip} />)}
    </section>
  );
}
export default AssignedTripsSection;
