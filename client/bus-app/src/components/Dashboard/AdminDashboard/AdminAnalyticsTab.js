import React from "react";
import { Bus, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";
import { fleet } from "../../../data/sharedData";

function AdminAnalyticsTab({ trips = [], reports = [] }) {
  const safeTrips = Array.isArray(trips) ? trips : [];
  const safeReports = Array.isArray(reports) ? reports : [];

  const totalTrips = safeTrips.length;
  const activeBuses = new Set(safeTrips.map((trip) => trip.bus).filter(Boolean)).size;
  const demandRequests = safeTrips.filter(
    (trip) => trip.total > 0 && trip.passengers / trip.total >= 0.8,
  ).length;
  const fullBuses = safeTrips.filter((trip) => trip.status === "Full").length;

  const averageOccupancy =
    totalTrips === 0
      ? 0
      : Math.round(
          (safeTrips.reduce((sum, trip) => sum + trip.passengers / trip.total, 0) /
            totalTrips) *
            100,
        );

  const fleetUtilization =
    fleet.length === 0 ? 0 : Math.round((activeBuses / fleet.length) * 100);

  const serviceQuality =
    totalTrips === 0
      ? 100
      : Math.round(
          (safeTrips.filter((trip) => trip.status !== "Full").length / totalTrips) * 100,
        );

  const tripStatusData = [
    {
      label: "Available",
      count: safeTrips.filter((trip) => trip.status === "Available").length,
      className: "status-available",
    },
    {
      label: "In Transit",
      count: safeTrips.filter((trip) => trip.status === "In Transit").length,
      className: "status-transit",
    },
    {
      label: "Full",
      count: fullBuses,
      className: "status-full",
    },
  ];

  const categoryData = fleet.reduce((acc, bus) => {
    const key = bus.category || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h2>System Analytics</h2>
          <p>Comprehensive insights and performance metrics</p>
        </div>
      </div>

      <div className="analytics-top-cards">
        <div className="analytics-main-card blue">
          <Bus size={22} />
          <strong>{totalTrips}</strong>
          <span>Total Trips Today</span>
        </div>

        <div className="analytics-main-card green">
          <CheckCircle2 size={22} />
          <strong>{activeBuses}</strong>
          <span>Active Buses</span>
        </div>

        <div className="analytics-main-card orange">
          <TrendingUp size={22} />
          <strong>{demandRequests}</strong>
          <span>Demand Requests</span>
        </div>

        <div className="analytics-main-card red">
          <AlertTriangle size={22} />
          <strong>{fullBuses}</strong>
          <span>Full Buses</span>
        </div>
      </div>

      <div className="analytics-chart-grid">
        <div className="analytics-chart-box">
          <h3>Route Occupancy Rates</h3>
          <div className="bar-chart-list">
            {safeTrips.map((trip) => {
              const percent = Math.round((trip.passengers / trip.total) * 100);
              return (
                <div key={trip.id} className="chart-row">
                  <span>{trip.route}</span>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill" style={{ width: `${percent}%` }} />
                  </div>
                  <strong>{percent}%</strong>
                </div>
              );
            })}
          </div>
        </div>

        <div className="analytics-chart-box">
          <h3>Hourly Trip Distribution</h3>
          <div className="hourly-chart-list">
            {safeTrips.map((trip) => (
              <div key={trip.id} className="hour-pill">
                {trip.departure}
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-chart-box">
          <h3>Trip Status Distribution</h3>
          <div className="status-distribution">
            {tripStatusData.map((item) => {
              const percent = totalTrips === 0 ? 0 : Math.round((item.count / totalTrips) * 100);
              return (
                <div key={item.label} className="distribution-row">
                  <span>{item.label}</span>
                  <div className="chart-bar-track">
                    <div className={`chart-bar-fill ${item.className}`} style={{ width: `${percent}%` }} />
                  </div>
                  <strong>{percent}%</strong>
                </div>
              );
            })}
          </div>
        </div>

        <div className="analytics-chart-box">
          <h3>Bus Fleet by Category</h3>
          <div className="status-distribution">
            {Object.entries(categoryData).map(([category, count]) => {
              const percent = fleet.length === 0 ? 0 : Math.round((count / fleet.length) * 100);
              return (
                <div key={category} className="distribution-row">
                  <span>{category}</span>
                  <div className="chart-bar-track">
                    <div className="chart-bar-fill category-fill" style={{ width: `${percent}%` }} />
                  </div>
                  <strong>{percent}%</strong>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="analytics-mini-cards">
        <div className="summary-box">
          <span>Average Occupancy</span>
          <strong>{averageOccupancy}%</strong>
        </div>

        <div className="summary-box">
          <span>Fleet Utilization</span>
          <strong>{fleetUtilization}%</strong>
        </div>

        <div className="summary-box">
          <span>Service Quality</span>
          <strong>{serviceQuality}%</strong>
        </div>
      </div>

      <div className="recommendations-box">
        <h3>AI-Powered Insights & Recommendations</h3>
        <ul>
          <li>Current average occupancy is {averageOccupancy}% across all routes.</li>
          <li>{fullBuses} route(s) are full and may need extra buses during peak hours.</li>
          <li>{demandRequests} high-demand route(s) are detected from live trip data.</li>
          <li>{safeReports.length} report(s) are currently stored in the shared reports data.</li>
        </ul>
      </div>
    </section>
  );
}

export default AdminAnalyticsTab;
