import React from "react";
import { Clock, CheckCircle2, User, AlertCircle } from "lucide-react";

function PickupRequestsTab({ pickupStatus = {} }) {
  const pickupRows = [
    {
      student: "Sarah Ahmed",
      bus: "BUS-001",
      route: "Hawalli City - Beeyout",
      city: "Hawalli",
      location: "Hawalli Block 3, Building 12",
      block: "3",
      arrivalTime: "06:45 AM",
      pickupTime: "06:47 AM",
      duration: "2 min",
      status: "Picked Up",
    },
    {
      student: "Mariam Hassan",
      bus: "BUS-002",
      route: "Salmiya City - Beeyout",
      city: "Salmiya",
      location: "Salmiya Block 1, Building 5",
      block: "1",
      arrivalTime: "06:35 AM",
      pickupTime: "06:38 AM",
      duration: "3 min",
      status: "Picked Up",
    },
    {
      student: "Noor Abdullah",
      bus: "BUS-004",
      route: "Farwaniya City - Beeyout",
      city: "Farwaniya",
      location: "Farwaniya Block 2, Building 15",
      block: "2",
      arrivalTime: "Pending",
      pickupTime: "Pending",
      duration: "N/A",
      status: "Pending",
    },
    {
      student: "Huda Khalid",
      bus: "BUS-002",
      route: "Salmiya City - Beeyout",
      city: "Salmiya",
      location: "Salmiya Block 3, Building 20",
      block: "3",
      arrivalTime: "06:40 AM",
      pickupTime: "Pending",
      duration: "N/A",
      status: "Driver Arrived",
    },
  ];

  const completed = pickupRows.filter((r) => r.status === "Completed").length;

  const pickedUp = pickupRows.filter((r) => r.status === "Picked Up").length;

  const pending = pickupRows.filter((r) => r.status === "Pending").length;

  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h2>Pickup Records</h2>
          <p>Track driver arrival and pickup times for Beeyout service</p>
        </div>
      </div>

      {/* Filters */}
      <div className="pickup-filters">
        <input type="date" />

        <select>
          <option>All Cities</option>
          <option>Hawalli</option>
          <option>Salmiya</option>
          <option>Farwaniya</option>
        </select>

        <select>
          <option>All Statuses</option>
          <option>Picked Up</option>
          <option>Pending</option>
          <option>Driver Arrived</option>
        </select>
      </div>

      {/* Stats */}
      <div className="pickup-stats-row">
        <div className="pickup-stat-card">
          <Clock />
          <strong>{pickupRows.length}</strong>
          <span>Total Records</span>
        </div>

        <div className="pickup-stat-card green">
          <CheckCircle2 />
          <strong>{completed}</strong>
          <span>Completed</span>
        </div>

        <div className="pickup-stat-card blue">
          <User />
          <strong>{pickedUp}</strong>
          <span>Picked Up</span>
        </div>

        <div className="pickup-stat-card gray">
          <AlertCircle />
          <strong>{pending}</strong>
          <span>Pending</span>
        </div>
      </div>

      {/* Table */}
      <table className="simple-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Bus / Route</th>
            <th>City</th>
            <th>Location</th>
            <th>Block</th>
            <th>Arrival Time</th>
            <th>Pickup Time</th>
            <th>Duration</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {pickupRows.map((row, index) => (
            <tr key={index}>
              <td>{row.student}</td>
              <td>
                <strong>{row.bus}</strong>
                <br />
                <small>{row.route}</small>
              </td>
              <td>{row.city}</td>
              <td>{row.location}</td>
              <td>{row.block}</td>
              <td>{row.arrivalTime}</td>
              <td>{row.pickupTime}</td>
              <td>{row.duration}</td>
              <td>
                <span
                  className={
                    row.status === "Picked Up"
                      ? "badge-blue mini-badge"
                      : row.status === "Driver Arrived"
                        ? "badge-yellow mini-badge"
                        : "inactive-badge"
                  }
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Performance Summary */}
      <div className="pickup-performance">
        <h3>Performance Summary</h3>

        <div className="pickup-performance-grid">
          <div className="summary-box">
            <span>Average Wait Time</span>
            <strong>3 min</strong>
          </div>

          <div className="summary-box">
            <span>On-Time Pickups</span>
            <strong>50%</strong>
          </div>

          <div className="summary-box">
            <span>Total Students</span>
            <strong>1</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PickupRequestsTab;
