import React from "react";
import DashboardLayout from "../DashboardLayout";
import ScheduleTab from "./ScheduleTab";
import SubscriptionTab from "./SubscriptionTab";
import ReportsTab from "./ReportsTab";
import NotificationsTab from "./NotificationsTab";
import ProfileTab from "./ProfileTab";

function StudentDashboard({ signedInUser, studentTab, setStudentTab, trips, studentTripStatus, handleTripCheckIn, reports, addReport, logout }) {
  const renderContent = () => {
    if (studentTab === "Schedules") return <ScheduleTab user={signedInUser} trips={trips} studentTripStatus={studentTripStatus} onTripCheckIn={handleTripCheckIn} />;
    if (studentTab === "Beeyout Service") return <SubscriptionTab />;
    if (studentTab === "Reports") return <ReportsTab reports={reports} addReport={addReport} />;
    if (studentTab === "Alerts") return <NotificationsTab />;
    return <ProfileTab user={signedInUser} />;
  };
  return <DashboardLayout portalTitle="Student Portal" welcome={`Welcome back, ${signedInUser.name}`} menu={["Schedules", "Beeyout Service", "Reports", "Alerts", "Profile"]} activeTab={studentTab} setActiveTab={setStudentTab} onLogout={logout}>{renderContent()}</DashboardLayout>;
}
export default StudentDashboard;
