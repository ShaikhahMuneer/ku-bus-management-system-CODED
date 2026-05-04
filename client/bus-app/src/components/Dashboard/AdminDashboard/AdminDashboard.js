import React from "react";
import DashboardLayout from "../DashboardLayout";
import MonitorTab from "./MonitorTab";
import BusManagementTab from "./BusManagementTab";
import DemandTab from "./DemandTab";
import ReportsManagementTab from "./ReportsManagementTab";
import AdminAnalyticsTab from "./AdminAnalyticsTab";
import PickupRequestsTab from "./PickupRequestsTab";
import AdminProfileSection from "./AdminProfileSection";

function AdminDashboard({
  signedInUser,
  adminTab,
  setAdminTab,
  trips,
  reports,
  updateReportStatus,
  pickupStatus,
  logout,
}) {
  const renderContent = () => {
    if (adminTab === "Monitor") {
      return <MonitorTab trips={trips} pickupStatus={pickupStatus} />;
    }

    if (adminTab === "Bus & Routes") {
      return <BusManagementTab trips={trips} />;
    }

    if (adminTab === "Pickup Records") {
      return <PickupRequestsTab trips={trips} pickupStatus={pickupStatus} />;
    }

    if (adminTab === "Demand") {
      return <DemandTab trips={trips} />;
    }

    if (adminTab === "Analytics") {
      return (
        <AdminAnalyticsTab
          trips={trips}
          reports={reports}
          pickupStatus={pickupStatus}
        />
      );
    }

    if (adminTab === "Reports") {
      return (
        <ReportsManagementTab
          reports={reports}
          updateReportStatus={updateReportStatus}
        />
      );
    }

    return <AdminProfileSection admin={signedInUser} />;
  };

  return (
    <DashboardLayout
      portalTitle="Admin Portal"
      welcome={`Welcome back, ${signedInUser?.name || "Admin User"}`}
      menu={[
        "Monitor",
        "Bus & Routes",
        "Pickup Records",
        "Demand",
        "Analytics",
        "Reports",
        "Profile",
      ]}
      activeTab={adminTab}
      setActiveTab={setAdminTab}
      onLogout={logout}
    >
      {renderContent()}
    </DashboardLayout>
  );
}

export default AdminDashboard;
