import React, { useMemo, useState } from "react";

function ReportsManagementTab({ reports = [], updateReportStatus }) {
  const [selectedRoute, setSelectedRoute] = useState("All Routes");
  const [selectedDate, setSelectedDate] = useState("");

  const routeRatings = [
    { route: "Engineering Campus Route", rating: 4.5, reviews: 45 },
    { route: "Medical Campus Route", rating: 4.2, reviews: 38 },
    { route: "Al Malqa Regional", rating: 3.8, reviews: 52 },
    { route: "Al Nakheel Regional", rating: 4.0, reviews: 41 },
  ];

  const uniqueRoutes = useMemo(() => {
    return Array.from(new Set(reports.map((report) => report.route))).filter(Boolean);
  }, [reports]);

  const filteredReports = reports.filter((report) => {
    const routeMatch = selectedRoute === "All Routes" || report.route === selectedRoute;
    const dateMatch = selectedDate === "" || report.date === selectedDate;
    return routeMatch && dateMatch;
  });

  const pendingCount = reports.filter((report) => report.status === "Pending").length;
  const resolvedCount = reports.filter((report) => report.status === "Resolved").length;

  const handleStatusChange = (reportId, newStatus) => {
    if (updateReportStatus) updateReportStatus(reportId, newStatus);
  };

  const getStatusClass = (status) => {
    if (status === "Resolved") return "badge-green mini-badge";
    if (status === "In Progress") return "badge-blue mini-badge";
    return "badge-yellow mini-badge";
  };

  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h2>Reports & Ratings</h2>
          <p>Monitor service quality and handle complaints</p>
        </div>
      </div>

      <div className="reports-summary-box">
        <h3>Service Performance Summary</h3>
        <div className="reports-summary-grid">
          <div>
            <strong>4.1</strong>
            <span> Overall Rating</span>
          </div>
          <div>
            <p>Total Reports: {reports.length}</p>
            <p>Pending: {pendingCount}</p>
            <p>Resolved: {resolvedCount}</p>
          </div>
        </div>
      </div>

      <div className="route-ratings-box">
        <h3>Route Ratings</h3>
        {routeRatings.map((route, index) => (
          <div key={index} className="rating-row">
            <div>
              <strong>{route.route}</strong>
              <small>{route.reviews} reviews</small>
            </div>
            <span>{route.rating} ★</span>
          </div>
        ))}
      </div>

      <div className="student-reports-box">
        <div className="reports-filter-row">
          <select value={selectedRoute} onChange={(e) => setSelectedRoute(e.target.value)}>
            <option>All Routes</option>
            {uniqueRoutes.map((route) => (
              <option key={route}>{route}</option>
            ))}
          </select>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        </div>

        {filteredReports.length === 0 ? (
          <div className="empty-routes">No reports found.</div>
        ) : (
          filteredReports.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-header">
                <strong>{report.route}</strong>
                <span className={getStatusClass(report.status)}>{report.status}</span>
              </div>

              <small>
                {report.date} • By: {report.studentName}
              </small>
              <p>{report.text}</p>

              <div className="report-actions-row">
                <button
                  type="button"
                  className={report.status === "Pending" ? "status-btn active-pending" : "status-btn"}
                  onClick={() => handleStatusChange(report.id, "Pending")}
                >
                  Pending
                </button>
                <button
                  type="button"
                  className={report.status === "In Progress" ? "status-btn active-progress" : "status-btn"}
                  onClick={() => handleStatusChange(report.id, "In Progress")}
                >
                  In Progress
                </button>
                <button
                  type="button"
                  className={report.status === "Resolved" ? "status-btn active-resolved" : "status-btn"}
                  onClick={() => handleStatusChange(report.id, "Resolved")}
                >
                  Resolved
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default ReportsManagementTab;
