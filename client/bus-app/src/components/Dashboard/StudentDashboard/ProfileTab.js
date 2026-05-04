import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Edit2, Save, X } from "lucide-react";

function ProfileTab({ user }) {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    fullName: user.name,
    universityId: user.universityId,
    email: user.email,
    role: "Student",
    phone: user.phone,
    pickupLocation: user.location,
    blockNumber: "Block 3",
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
          <h2>Profile Settings</h2>
          <p>Manage your personal information</p>
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
            <small>Cannot be modified</small>
          </div>

          <div className="profile-item">
            <label>University ID</label>
            <div className="profile-value">
              <span>{profile.universityId}</span>
            </div>
            <small>Cannot be modified</small>
          </div>

          <div className="profile-item">
            <label>Email</label>
            <div className="profile-value">
              <Mail size={15} />
              <span>{profile.email}</span>
            </div>
            <small>Cannot be modified</small>
          </div>

          <div className="profile-item">
            <label>Role</label>
            <div className="profile-value">
              <span>{profile.role}</span>
            </div>
            <small>Cannot be modified</small>
          </div>
        </div>

        <hr />

        <h3>Editable Information</h3>

        <div className="profile-grid-new">
          <div className="profile-item">
            <label>Phone Number *</label>
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
            <label>Pickup Location</label>
            {isEditing ? (
              <input
                name="pickupLocation"
                value={editData.pickupLocation}
                onChange={handleChange}
                className="profile-input"
              />
            ) : (
              <div className="profile-value">
                <MapPin size={15} />
                <span>{profile.pickupLocation}</span>
              </div>
            )}
          </div>

          <div className="profile-item">
            <label>Block Number</label>
            {isEditing ? (
              <input
                name="blockNumber"
                value={editData.blockNumber}
                onChange={handleChange}
                className="profile-input"
              />
            ) : (
              <div className="profile-value">
                <span>{profile.blockNumber}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProfileTab;
