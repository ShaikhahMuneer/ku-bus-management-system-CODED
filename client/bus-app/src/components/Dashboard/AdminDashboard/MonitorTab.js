import React from "react";

function MonitorTab({ trips, pickupStatus }) {
  const inTransit = trips.filter((trip) => trip.status === "In Transit").length;

  const full = trips.filter((trip) => trip.status === "Full").length;

  const available = trips.filter((trip) => trip.status === "Available").length;

  const pickedStudents = Object.values(pickupStatus).filter(
    (status) => status.pickedUp,
  ).length;

  return (
    <>
      <div className="admin-stats-row">
        <div className="admin-stat orange">
          {inTransit}
          <br />
          <span>In Transit Now</span>
        </div>

        <div className="admin-stat pink">
          {full}
          <br />
          <span>Full Capacity</span>
        </div>

        <div className="admin-stat green">
          {available}
          <br />
          <span>Available Buses</span>
        </div>

        <div className="admin-stat blue">
          {pickedStudents}
          <br />
          <span>Beeyout Pickups</span>
        </div>
      </div>

      <section className="section-card">
        <div className="section-header">
          <div>
            <h2>Real-Time Bus Monitoring</h2>
            <p>Student check-ins and driver status updates appear here</p>
          </div>
        </div>

        {trips.map((trip) => {
          const percent = Math.round((trip.passengers / trip.total) * 100);

          return (
            <div key={trip.id} className="admin-monitor-card">
              <div>
                <strong>{trip.route}</strong>
                <p>
                  {trip.passengers}/{trip.total} passengers • {percent}%
                  occupancy
                </p>
              </div>

              <div>{trip.status}</div>
            </div>
          );
        })}
      </section>
    </>
  );
}

export default MonitorTab;
