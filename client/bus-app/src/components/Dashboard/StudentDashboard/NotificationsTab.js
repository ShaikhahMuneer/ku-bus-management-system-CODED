import React, { useState } from "react";
import { Bell, Clock3 } from "lucide-react";
import { notifications } from "./studentData";

function NotificationItem({ text, route, bus, time }) {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="notification-card">
      <div className="notification-left">
        <div className="notification-icon">
          <Bell size={20} />
        </div>

        <div>
          <h4>{text}</h4>
          <p>Route: {route}</p>
          <p>Bus: {bus}</p>
          <p className="notification-time">
            <Clock3 size={14} />
            {time}
          </p>
        </div>
      </div>

      <button
        className={`notification-toggle ${enabled ? "toggle-active" : ""}`}
        onClick={() => setEnabled(!enabled)}
      >
        <span></span>
      </button>
    </div>
  );
}

function NotificationsTab() {
  return (
    <section className="section-card">
      <div className="section-header">
        <h2>Notifications</h2>
        <p>Manage your departure alerts and notifications</p>
      </div>

      <div className="departure-alert-box">
        <div>
          <h3>Departure Alerts</h3>
          <p>Receive notifications 10 minutes before bus departure</p>
        </div>

        <button className="notification-toggle toggle-active">
          <span></span>
        </button>
      </div>

      <div className="notifications-list">
        {notifications.map((item) => (
          <NotificationItem
            key={item.id}
            text={item.text}
            route={item.route || "Shuwaikh → Al-Shadadiya"}
            bus={item.bus || "BUS-003"}
            time={item.time || "01/03/2026, 7:50:00 AM"}
          />
        ))}
      </div>
    </section>
  );
}

export default NotificationsTab;
