import React from "react";
import StudentDashboard from "./StudentDashboard/StudentDashboard";
import DriverDashboard from "./DriverDashboard/DriverDashboard";
import AdminDashboard from "./AdminDashboard/AdminDashboard";

function DashboardRouter(props) {
  const { page } = props;

  if (page === "student") return <StudentDashboard {...props} />;
  if (page === "driver") return <DriverDashboard {...props} />;
  if (page === "admin") return <AdminDashboard {...props} />;

  return null;
}

export default DashboardRouter;