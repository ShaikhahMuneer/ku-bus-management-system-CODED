import React from "react";
import { TrendingUp, Calendar, BarChart3 } from "lucide-react";

function DemandTab() {
  const demandData = [
    {
      route: "Adailiya → Al-Shadadiya",
      description:
        "College of Architecture - Adailiya Area → Al-Shadadiya Main Campus",
      requests: 2,
      timeline: [
        { date: "2026-03-01", time: "07:00", status: "In Transit" },
        { date: "2026-03-01", time: "07:00", status: "In Transit" },
      ],
    },
  ];

  const totalRequests = demandData.reduce(
    (sum, route) => sum + route.requests,
    0,
  );

  const highestDemand = Math.max(...demandData.map((route) => route.requests));

  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h2>Additional Bus Demand</h2>
          <p>Track student requests for additional bus services</p>
        </div>
      </div>

      {/* Stats */}
      <div className="demand-stats-row">
        <div className="demand-stat-card orange">
          <TrendingUp size={20} />
          <strong>{totalRequests}</strong>
          <span>Total Requests</span>
          <small>All time</small>
        </div>

        <div className="demand-stat-card blue">
          <Calendar size={20} />
          <strong>{demandData.length}</strong>
          <span>Affected Routes</span>
          <small>Needs attention</small>
        </div>

        <div className="demand-stat-card purple">
          <BarChart3 size={20} />
          <strong>{highestDemand}</strong>
          <span>Highest Demand</span>
          <small>Single route</small>
        </div>
      </div>

      {/* Demand By Route */}
      <div className="demand-route-box">
        <h3>Demand by Route</h3>

        {demandData.map((route, index) => (
          <div key={index} className="demand-card">
            <div className="demand-card-top">
              <div>
                <h4>{route.route}</h4>
                <p>{route.description}</p>
              </div>

              <div className="demand-number">
                <strong>{route.requests}</strong>
                <span>requests</span>
              </div>
            </div>

            <div className="demand-progress">
              <div
                className="demand-progress-fill"
                style={{
                  width: `${route.requests * 20}%`,
                }}
              />
            </div>

            <h5>Request Timeline:</h5>

            {route.timeline.map((item, i) => (
              <div key={i} className="timeline-row">
                <span>{item.date}</span>
                <span>{item.time}</span>
                <span>{item.status}</span>
              </div>
            ))}

            <button className="primary-btn full-width">
              Schedule Additional Bus
            </button>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      <div className="recommendations-box">
        <h3>📊 Recommendations</h3>

        <ul>
          <li>Consider adding buses to routes with 5+ requests</li>
          <li>Review demand patterns to optimize scheduling</li>
          <li>High demand during peak hours (7:00 AM - 8:00 AM)</li>
          <li>Monitor full buses to prevent student inconvenience</li>
        </ul>
      </div>
    </section>
  );
}

export default DemandTab;
