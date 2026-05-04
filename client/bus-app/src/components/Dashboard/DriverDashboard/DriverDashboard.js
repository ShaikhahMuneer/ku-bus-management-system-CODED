import React from "react";
import DashboardLayout from "../DashboardLayout";
import AssignedTripsSection from "./AssignedTripsSection";
import PickupListSection from "./PickupListSection";
import DriverProfileSection from "./DriverProfileSection";

function DriverDashboard({ signedInUser, driverTab, setDriverTab, trips, updateTripStatus, pickupStatus, updatePickupStatus, logout }) {
  const driverTrips = trips.filter((trip) => trip.driverId === signedInUser.id);
  const renderContent = () => {
    if (driverTab === "My Trips") return <AssignedTripsSection trips={driverTrips} updateTripStatus={updateTripStatus} />;
    if (driverTab === "Pickup List") return <PickupListSection pickupStatus={pickupStatus} updatePickupStatus={updatePickupStatus} />;
    return <DriverProfileSection driver={signedInUser} />;
  };
  return <DashboardLayout portalTitle="Driver Portal" welcome={`Welcome back, ${signedInUser.name}`} menu={["My Trips", "Pickup List", "Profile"]} activeTab={driverTab} setActiveTab={setDriverTab} onLogout={logout}>{renderContent()}</DashboardLayout>;
}
export default DriverDashboard;
