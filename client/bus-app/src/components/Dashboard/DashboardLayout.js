import React from "react";

function DashboardLayout({
  portalTitle,
  welcome,
  menu,
  activeTab,
  setActiveTab,
  children,
  onLogout
}) {
  return (
    <div className="dashboard-page">
      <div className="dashboard-topbar">
        <div className="portal-badge">🚌 {portalTitle}</div>
        <div className="logout-link" onClick={onLogout}>
          Logout
        </div>
      </div>

      <div className="dashboard-body">
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo">🚌</div>
            <div>
              <h3>{portalTitle}</h3>
              <p>{welcome}</p>
            </div>
          </div>

          <div className="sidebar-menu">
            {menu.map((item) => (
              <button
                key={item}
                className={activeTab === item ? "side-btn active-side-btn" : "side-btn"}
                onClick={() => setActiveTab(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="quick-stats">
            <h4>Quick Stats</h4>
            <p>Today’s Trips</p>
            <p>Notifications</p>
            <p>Reports</p>
          </div>
        </aside>

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;