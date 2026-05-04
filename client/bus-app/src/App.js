import React, { useEffect, useState } from "react";
import "./App.css";
import LoginPage from "./components/Auth/LoginPage";
import SignUpPage from "./components/Auth/SignUpPage";
import ForgotPasswordPage from "./components/Auth/ForgotPasswordPage";
import DashboardRouter from "./components/Dashboard/DashboardRouter";
import { initialTrips, initialReports } from "./data/sharedData";
import { authApi, bookingsApi, mapReport, mapTrip, mapUser, reportsApi, tripsApi } from "./services/api";

function App() {
  const [page, setPage] = useState("login");
  const [studentTab, setStudentTab] = useState("Schedules");
  const [driverTab, setDriverTab] = useState("My Trips");
  const [adminTab, setAdminTab] = useState("Monitor");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [signedInUser, setSignedInUser] = useState(null);
  const [trips, setTrips] = useState(initialTrips);
  const [studentTripStatus, setStudentTripStatus] = useState({});
  const [studentBookings, setStudentBookings] = useState({});
  const [reports, setReports] = useState(initialReports);
  const [pickupStatus, setPickupStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const loadDashboardData = async () => {
    try {
      const [tripsResponse, reportsResponse] = await Promise.all([
        tripsApi.getAll(),
        reportsApi.getAll(),
      ]);

      setTrips((tripsResponse.data || []).map(mapTrip));
      setReports((reportsResponse.data || []).map(mapReport));
    } catch (error) {
      console.error("Failed to load backend data:", error.message);
      alert("Backend data could not load. Make sure the backend is running on port 3001.");
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("busToken");
    const savedUser = localStorage.getItem("busUser");

    if (savedToken && savedUser) {
      const user = JSON.parse(savedUser);
      setSignedInUser(user);
      setPage(user.role);
      loadDashboardData();
    }
  }, []);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setLoginError("");

      const response = await authApi.login(loginEmail.trim(), loginPassword);
      const user = mapUser(response.user);

      localStorage.setItem("busToken", response.token);
      localStorage.setItem("busUser", JSON.stringify(user));

      setSignedInUser(user);
      setLoginError("");
      setPage(user.role);
      await loadDashboardData();
    } catch (error) {
      setLoginError(error.message || "Wrong email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (formData) => {
    try {
      setIsLoading(true);

      const response = await authApi.register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role.toLowerCase(),
        universityId: formData.universityId || "",
        gender: formData.gender || "female",
      });

      const user = mapUser(response.user);

      localStorage.setItem("busToken", response.token);
      localStorage.setItem("busUser", JSON.stringify(user));

      setSignedInUser(user);
      setPage(user.role);
      await loadDashboardData();
    } catch (error) {
      alert(error.message || "Sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTripCheckIn = async (tripId) => {
    if (!signedInUser || signedInUser.role !== "student") return;

    const key = `${signedInUser.id}-${tripId}`;

    try {
      if (studentTripStatus[key] === "boarded") {
        const bookingId = studentBookings[key];
        if (bookingId) await bookingsApi.cancel(bookingId);

        setStudentTripStatus((prev) => ({ ...prev, [key]: "cancelled" }));
        setStudentBookings((prev) => {
          const copy = { ...prev };
          delete copy[key];
          return copy;
        });
      } else {
        const bookingResponse = await bookingsApi.create(signedInUser.id, tripId);
        await bookingsApi.checkIn(bookingResponse.data._id);

        setStudentTripStatus((prev) => ({ ...prev, [key]: "boarded" }));
        setStudentBookings((prev) => ({ ...prev, [key]: bookingResponse.data._id }));
      }

      await loadDashboardData();
    } catch (error) {
      alert(error.message || "Could not update booking.");
    }
  };

  const updateTripStatus = async (tripId, newStatus) => {
    try {
      const response = await tripsApi.updateStatus(tripId, newStatus);
      const updatedTrip = mapTrip(response.data);
      setTrips((prevTrips) => prevTrips.map((trip) => (trip.id === tripId ? updatedTrip : trip)));
    } catch (error) {
      alert(error.message || "Could not update trip status.");
    }
  };

  const addReport = async (report) => {
    try {
      const response = await reportsApi.create({
        student: signedInUser.id,
        description: report.text,
      });

      setReports((prevReports) => [mapReport(response.data), ...prevReports]);
    } catch (error) {
      alert(error.message || "Could not submit report.");
    }
  };

  const updateReportStatus = async (reportId, status) => {
    try {
      const backendStatus = status === "Resolved" ? "resolved" : status === "Rejected" ? "rejected" : "in-review";
      const response = await reportsApi.update(reportId, { reportStatus: backendStatus });
      const updatedReport = mapReport(response.data);

      setReports((prevReports) => prevReports.map((report) => (report.id === reportId ? updatedReport : report)));
    } catch (error) {
      alert(error.message || "Could not update report status.");
    }
  };

  const updatePickupStatus = (studentId, nextStatus) => {
    const time = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setPickupStatus((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        ...nextStatus,
        arrivedTime: nextStatus.arrived && !prev[studentId]?.arrivedTime ? time : prev[studentId]?.arrivedTime,
        pickedTime: nextStatus.pickedUp && !prev[studentId]?.pickedTime ? time : prev[studentId]?.pickedTime,
      },
    }));
  };

  const logout = () => {
    localStorage.removeItem("busToken");
    localStorage.removeItem("busUser");
    setSignedInUser(null);
    setLoginEmail("");
    setLoginPassword("");
    setLoginError("");
    setPage("login");
  };

  return (
    <div className="app">
      {page === "login" && (
        <LoginPage
          setPage={setPage}
          loginEmail={loginEmail}
          setLoginEmail={setLoginEmail}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          handleLogin={handleLogin}
          loginError={loginError}
          isLoading={isLoading}
        />
      )}

      {page === "signup" && <SignUpPage setPage={setPage} handleSignUp={handleSignUp} isLoading={isLoading} />}
      {page === "forgot" && <ForgotPasswordPage setPage={setPage} />}

      {(page === "student" || page === "driver" || page === "admin") && signedInUser && (
        <DashboardRouter
          page={page}
          signedInUser={signedInUser}
          studentTab={studentTab}
          setStudentTab={setStudentTab}
          driverTab={driverTab}
          setDriverTab={setDriverTab}
          adminTab={adminTab}
          setAdminTab={setAdminTab}
          trips={trips}
          studentTripStatus={studentTripStatus}
          handleTripCheckIn={handleTripCheckIn}
          updateTripStatus={updateTripStatus}
          reports={reports}
          addReport={addReport}
          updateReportStatus={updateReportStatus}
          pickupStatus={pickupStatus}
          updatePickupStatus={updatePickupStatus}
          logout={logout}
        />
      )}
    </div>
  );
}

export default App;
