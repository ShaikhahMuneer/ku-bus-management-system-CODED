import React, { useState } from "react";
import { kuwaitAreas } from "./kuwaitAreas";
import {
  Home,
  MapPin,
  Clock3,
  Phone,
  DollarSign,
  CheckCircle,
  Send,
  Pencil,
} from "lucide-react";

function BeeyoutCard({ trip, isCheckedIn, onCheckIn }) {
  const seats = isCheckedIn ? trip.seats + 1 : trip.seats;
  const percent = Math.round((seats / trip.total) * 100);

  return (
    <div className="schedule-card green-border">
      <div className="schedule-main">
        <div className="schedule-info">
          <div className="row-wrap">
            <h3>{trip.route}</h3>
            <span className="mini-badge badge-green">Available</span>
            <span className="mini-badge badge-blue">Female</span>
            <span className="mini-badge badge-pink">Female Only</span>
          </div>

          <p>{trip.description}</p>
          <p>
            {seats} of {trip.total} seats
          </p>
        </div>

        <div className="schedule-side">
          <p>🕒 Arrives in 12 min</p>
          <p>🚌 Requested Beeyout Bus</p>

          <button className="purple-btn" onClick={onCheckIn}>
            {isCheckedIn ? "Cancel Boarding" : "Check-In"}
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

function SubscriptionTab() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [requestedBus, setRequestedBus] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  const [formData, setFormData] = useState({
    governorate: "",
    area: "",
    block: "",
    street: "",
    houseNumber: "",
    phone: "",
    toUniversity: "07:00 AM",
    fromUniversity: "03:00 PM",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "governorate") {
      setFormData({
        ...formData,
        governorate: value,
        area: "",
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.governorate ||
      !formData.area ||
      !formData.block ||
      !formData.street ||
      !formData.houseNumber ||
      !formData.phone
    ) {
      alert("Please fill all subscription fields.");
      return;
    }

    setIsSubscribed(true);
    setShowForm(false);
  };

  const handleRequestBus = () => {
    const newBus = {
      id: "requested-bus",
      route: `${formData.area} → Kuwait University Main Campus`,
      description: `Block ${formData.block}, Street ${formData.street}, House ${formData.houseNumber} → Kuwait University Main Campus`,
      seats: 1,
      total: 25,
    };

    setRequestedBus(newBus);
    setIsCheckedIn(false);
  };

  const handleCheckIn = () => {
    setIsCheckedIn((prev) => !prev);
  };

  return (
    <section className="section-card">
      <div className="section-header">
        <h2>Beeyout Service</h2>
        <p>
          {isSubscribed
            ? "Your active subscription details"
            : "Create your home subscription"}
        </p>
      </div>

      {isSubscribed && (
        <div className="new-subscription-card">
          <div className="subscription-top">
            <div className="subscription-title-group">
              <div className="subscription-main-icon">
                <Home size={20} />
              </div>

              <div>
                <h3>Active Subscription</h3>
                <p>Subscribed since 2026-02-01</p>
              </div>
            </div>

            <div className="subscription-check">
              <CheckCircle size={22} />
            </div>
          </div>

          <div className="new-subscription-grid">
            <div className="sub-info-box">
              <MapPin size={16} />
              <span>Home Location</span>
              <strong>
                {formData.area}, {formData.governorate}
              </strong>
            </div>

            <div className="sub-info-box">
              <MapPin size={16} />
              <span>Block Number</span>
              <strong>{formData.block}</strong>
            </div>

            <div className="sub-info-box">
              <Clock3 size={16} />
              <span>To University</span>
              <strong>{formData.toUniversity}</strong>
            </div>

            <div className="sub-info-box">
              <Clock3 size={16} />
              <span>From University</span>
              <strong>{formData.fromUniversity}</strong>
            </div>

            <div className="sub-info-box">
              <Phone size={16} />
              <span>Contact Number</span>
              <strong>{formData.phone}</strong>
            </div>

            <div className="sub-info-box">
              <DollarSign size={16} />
              <span>Semester Fee</span>
              <strong>15 KWD</strong>
            </div>
          </div>

          <div className="subscription-actions">
            <button
              className="request-location-btn"
              type="button"
              onClick={handleRequestBus}
            >
              <Send size={16} />
              Request Beeyout Bus to Saved Location
            </button>

            <button
              className="edit-subscription-btn"
              type="button"
              onClick={() => setShowForm(!showForm)}
            >
              <Pencil size={16} />
              {showForm ? "Hide Edit" : "Edit Subscription"}
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <form className="subscription-form-box" onSubmit={handleSubmit}>
          <h3>
            {isSubscribed ? "Edit Subscription" : "New Beeyout Subscription"}
          </h3>

          <div className="subscription-form-grid">
            <div>
              <label>Governorate</label>
              <select
                name="governorate"
                value={formData.governorate}
                onChange={handleChange}
              >
                <option value="">Select Governorate</option>
                {Object.keys(kuwaitAreas).map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Area</label>
              <select
                name="area"
                value={formData.area}
                onChange={handleChange}
                disabled={!formData.governorate}
              >
                <option value="">Select Area</option>
                {formData.governorate &&
                  kuwaitAreas[formData.governorate].map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label>Block Number</label>
              <input
                name="block"
                value={formData.block}
                onChange={handleChange}
                placeholder="Block Number"
              />
            </div>

            <div>
              <label>Street</label>
              <input
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Street"
              />
            </div>

            <div>
              <label>House Number</label>
              <input
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleChange}
                placeholder="House Number"
              />
            </div>

            <div>
              <label>Contact Number</label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+965..."
              />
            </div>
          </div>

          <button className="request-location-btn" type="submit">
            <Send size={16} />
            {isSubscribed ? "Update Subscription" : "Submit Subscription"}
          </button>
        </form>
      )}

      <div className="new-features-box">
        <h3>Service Features</h3>

        <div className="service-features">
          <div className="feature-box">
            <strong>Guaranteed Seat</strong>
            <p>Your seat is always reserved</p>
          </div>

          <div className="feature-box">
            <strong>Fixed Schedule</strong>
            <p>Daily pickup at your time</p>
          </div>

          <div className="feature-box">
            <strong>Door to Door</strong>
            <p>From home to campus</p>
          </div>
        </div>
      </div>

      <div className="space-top">
        {requestedBus ? (
          <BeeyoutCard
            trip={requestedBus}
            isCheckedIn={isCheckedIn}
            onCheckIn={handleCheckIn}
          />
        ) : (
          <div className="empty-routes">
            No bus requested yet. Click “Request Beeyout Bus to Saved Location”.
          </div>
        )}
      </div>
    </section>
  );
}

export default SubscriptionTab;
