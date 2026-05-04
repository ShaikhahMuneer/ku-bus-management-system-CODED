import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Edit2, Save, X } from "lucide-react";

function AdminProfileSection({ admin }) {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    fullName: admin?.name || "Admin User",
    adminId: admin?.universityId || "A2024001",
    email: admin?.email || "admin@university.edu",
    role: "Administrator",
    phone: admin?.phone || "+96550888888",
    officeLocation: admin?.officeLocation || admin?.location || "Head Office",
  });

  const [editData, setEditData] = useState(profile);

  const handleChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setProfile(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(profile);
    setIsEditing(false);
  };

  return (
    <section className="section-card profile-page">
      <div className="profile-header">
        <div>
          <h2>Administrator Profile</h2>
          <p>Manage your account information</p>
        </div>

        {!isEditing ? (
          <button
            className="profile-edit-btn"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 size={16} />
            Edit Profile
          </button>
        ) : (
          <div className="profile-actions">
            <button className="profile-save-btn" onClick={handleSave}>
              <Save size={16} />
              Save
            </button>

            <button className="profile-cancel-btn" onClick={handleCancel}>
              <X size={16} />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="profile-card-new">
        <div className="profile-grid-new">
          <div className="profile-item">
            <label>Full Name</label>
            <div className="profile-value">
              <User size={15} />
              <span>{profile.fullName}</span>
            </div>
          </div>

          <div className="profile-item">
            <label>Admin ID</label>
            <div className="profile-value">
              <span>{profile.adminId}</span>
            </div>
          </div>

          <div className="profile-item">
            <label>Email Address</label>
            <div className="profile-value">
              <Mail size={15} />
              <span>{profile.email}</span>
            </div>
          </div>

          <div className="profile-item">
            <label>Role</label>
            <div className="profile-value">
              <span>{profile.role}</span>
            </div>
          </div>
        </div>

        <hr />

        <h3>Editable Information</h3>

        <div className="profile-grid-new">
          <div className="profile-item">
            <label>Phone Number</label>
            {isEditing ? (
              <input
                name="phone"
                value={editData.phone}
                onChange={handleChange}
                className="profile-input"
              />
            ) : (
              <div className="profile-value">
                <Phone size={15} />
                <span>{profile.phone}</span>
              </div>
            )}
          </div>

          <div className="profile-item">
            <label>Office Location</label>
            {isEditing ? (
              <input
                name="officeLocation"
                value={editData.officeLocation}
                onChange={handleChange}
                className="profile-input"
              />
            ) : (
              <div className="profile-value">
                <MapPin size={15} />
                <span>{profile.officeLocation}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminProfileSection;
