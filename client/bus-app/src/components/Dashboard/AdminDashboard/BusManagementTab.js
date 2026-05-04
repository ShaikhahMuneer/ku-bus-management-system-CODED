import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { busesApi, usersApi, routesApi, tripsApi } from "../../../services/api";

const KUWAIT_GOVERNORATES = {
  "Capital Governorate": [
    "Kuwait City",
    "Dasma",
    "Daiya",
    "Mansouriya",
    "Qadsiya",
    "Nuzha",
    "Rawda",
    "Kaifan",
    "Shuwaikh",
    "Khaldiya",
    "Adailiya",
  ],
  "Hawalli Governorate": [
    "Hawalli",
    "Salmiya",
    "Jabriya",
    "Bayan",
    "Mishref",
    "Rumaithiya",
    "Salwa",
    "Shaab",
  ],
  "Farwaniya Governorate": [
    "Farwaniya",
    "Khaitan",
    "Omariya",
    "Andalous",
    "Riggae",
    "Jleeb Al-Shuyoukh",
  ],
  "Mubarak Al-Kabeer Governorate": [
    "Mubarak Al-Kabeer",
    "Sabah Al-Salem",
    "Qurain",
    "Adan",
    "Qusour",
    "Messila",
  ],
  "Ahmadi Governorate": [
    "Ahmadi",
    "Fintas",
    "Mangaf",
    "Mahboula",
    "Fahaheel",
    "Abu Halifa",
  ],
  "Jahra Governorate": ["Jahra", "Saad Al-Abdullah", "Qasr", "Naeem"],
};

function BusManagementTab() {
  const [showBusForm, setShowBusForm] = useState(false);
  const [showTripForm, setShowTripForm] = useState(false);

  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [editingBusId, setEditingBusId] = useState(null);
  const [editingRouteId, setEditingRouteId] = useState(null);

  const [busForm, setBusForm] = useState({
    busNumber: "",
    capacity: "",
    busType: "campus-off",
    genderCategory: "mixed",
  });

  const [routeForm, setRouteForm] = useState({
    routeName: "",
    routeType: "college",
    departureLocation: "",
    destination: "",
    city: "Shadadiya",
  });

  const [tripForm, setTripForm] = useState({
    bus: "",
    driver: "",
    route: "",
    governorate: "",
    area: "",
    departureTime: "",
    arrivalTime: "",
    availableSeats: "",
  });

  const loadData = async () => {
    try {
      const busesResponse = await busesApi.getAll();
      const usersResponse = await usersApi.getAll();
      const routesResponse = await routesApi.getAll();

      setBuses(busesResponse.data || []);
      setRoutes(routesResponse.data || []);
      setDrivers(
        (usersResponse.data || []).filter((user) => user.role === "driver")
      );
    } catch (error) {
      alert(error.message || "Failed to load admin data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const selectedBus = buses.find((bus) => bus._id === tripForm.bus);
  const selectedBusType = selectedBus?.busType || "";

  const filteredRoutes = routes.filter((route) => {
    if (!selectedBusType) return false;
    return route.routeType === selectedBusType;
  });

  const resetBusForm = () => {
    setBusForm({
      busNumber: "",
      capacity: "",
      busType: "campus-off",
      genderCategory: "mixed",
    });
    setEditingBusId(null);
    setShowBusForm(false);
  };

  const handleSaveBus = async () => {
    if (!busForm.busNumber || !busForm.capacity) {
      alert("Please enter bus number and capacity");
      return;
    }

    try {
      const payload = {
        busNumber: busForm.busNumber,
        capacity: Number(busForm.capacity),
        busType: busForm.busType,
        genderCategory: busForm.genderCategory,
        status: "available",
      };

      if (editingBusId) {
        await busesApi.update(editingBusId, payload);
        alert("Bus updated successfully");
      } else {
        await busesApi.create(payload);
        alert("Bus added successfully");
      }

      resetBusForm();
      await loadData();
    } catch (error) {
      alert(error.message || "Could not save bus");
    }
  };

  const handleEditBus = (bus) => {
    setBusForm({
      busNumber: bus.busNumber || "",
      capacity: bus.capacity || "",
      busType: bus.busType || "campus-off",
      genderCategory: bus.genderCategory || "mixed",
    });
    setEditingBusId(bus._id);
    setShowBusForm(true);
  };

  const handleDeleteBus = async (busId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bus?"
    );

    if (!confirmDelete) return;

    try {
      await busesApi.delete(busId);
      await loadData();
      alert("Bus deleted successfully");
    } catch (error) {
      alert(error.message || "Could not delete bus");
    }
  };

  const resetRouteForm = () => {
    setRouteForm({
      routeName: "",
      routeType: "college",
      departureLocation: "",
      destination: "",
      city: "Shadadiya",
    });
    setEditingRouteId(null);
  };

  const handleEditRoute = (route) => {
    setRouteForm({
      routeName: route.routeName || "",
      routeType: route.routeType || "college",
      departureLocation: route.departureLocation || "",
      destination: route.destination || "",
      city: route.city || "Shadadiya",
    });

    setEditingRouteId(route._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveRoute = async () => {
    if (
      !routeForm.routeName ||
      !routeForm.departureLocation ||
      !routeForm.destination
    ) {
      alert("Please fill route name, departure location, and destination");
      return;
    }

    try {
      const payload = {
        routeName: routeForm.routeName,
        routeType: routeForm.routeType,
        departureLocation: routeForm.departureLocation,
        destination: routeForm.destination,
        city: routeForm.city,
        blockStart: 0,
        blockEnd: 0,
      };

      if (editingRouteId) {
        await routesApi.update(editingRouteId, payload);
        alert("Route updated successfully");
      } else {
        await routesApi.create(payload);
        alert("Route added successfully");
      }

      resetRouteForm();
      await loadData();
    } catch (error) {
      alert(error.message || "Could not save route");
    }
  };

  const handleDeleteRoute = async (routeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this route?"
    );

    if (!confirmDelete) return;

    try {
      await routesApi.delete(routeId);
      await loadData();
      alert("Route deleted successfully");
    } catch (error) {
      alert(error.message || "Could not delete route");
    }
  };

  const handleAssignTrip = async () => {
    if (
      !tripForm.bus ||
      !tripForm.driver ||
      !tripForm.departureTime ||
      !tripForm.arrivalTime ||
      !tripForm.availableSeats
    ) {
      alert("Please fill bus, driver, time, and available seats");
      return;
    }

    if (selectedBusType === "beeyout") {
      if (!tripForm.governorate || !tripForm.area) {
        alert("Please select governorate and area for Beeyout trip");
        return;
      }
    } else {
      if (!tripForm.route) {
        alert("Please select a route");
        return;
      }
    }

    const departure = new Date(tripForm.departureTime);
    const arrival = new Date(tripForm.arrivalTime);

    if (arrival <= departure) {
      alert("Arrival time must be after departure time");
      return;
    }

    try {
      const payload = {
        bus: tripForm.bus,
        driver: tripForm.driver,
        departureTime: tripForm.departureTime,
        arrivalTime: tripForm.arrivalTime,
        availableSeats: Number(tripForm.availableSeats),
        tripStatus: "scheduled",
        currentOccupancy: 0,
      };

      if (selectedBusType === "beeyout") {
        payload.governorate = tripForm.governorate;
        payload.area = tripForm.area;
        payload.route = null;
      } else {
        payload.route = tripForm.route;
      }

      await tripsApi.create(payload);

      setTripForm({
        bus: "",
        driver: "",
        route: "",
        governorate: "",
        area: "",
        departureTime: "",
        arrivalTime: "",
        availableSeats: "",
      });

      setShowTripForm(false);
      alert("Trip assigned to driver successfully");
    } catch (error) {
      alert(error.message || "Could not assign trip");
    }
  };

  const activeBuses = buses.filter((bus) => bus.isActive !== false);

  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h2>Manage Buses & Routes</h2>
          <p>Configure buses, routes, and driver trip assignments</p>
        </div>

        <button
          type="button"
          className="primary-btn"
          onClick={() => {
            setShowBusForm(!showBusForm);
            setEditingBusId(null);
          }}
        >
          <Plus size={16} />
          Add Bus
        </button>
      </div>

      {showBusForm && (
        <div className="admin-form-box">
          <h3>{editingBusId ? "Edit Bus" : "Add New Bus"}</h3>

          <div className="admin-form-grid">
            <input
              placeholder="Bus Number e.g. BUS-099"
              value={busForm.busNumber}
              onChange={(e) =>
                setBusForm({ ...busForm, busNumber: e.target.value })
              }
            />

            <input
              placeholder="Capacity"
              type="number"
              value={busForm.capacity}
              onChange={(e) =>
                setBusForm({ ...busForm, capacity: e.target.value })
              }
            />

            <select
              value={busForm.busType}
              onChange={(e) =>
                setBusForm({ ...busForm, busType: e.target.value })
              }
            >
              <option value="beeyout">Beeyout</option>
              <option value="campus-off">Campus-Off</option>
              <option value="college">College / Masar</option>
            </select>

            <select
              value={busForm.genderCategory}
              onChange={(e) =>
                setBusForm({
                  ...busForm,
                  genderCategory: e.target.value,
                })
              }
            >
              <option value="female-only">Female Only</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          <div className="form-buttons-row">
            <button
              type="button"
              className="route-cancel-btn"
              onClick={resetBusForm}
            >
              Cancel
            </button>

            <button
              type="button"
              className="primary-btn"
              onClick={handleSaveBus}
            >
              {editingBusId ? "Update Bus" : "Add Bus"}
            </button>
          </div>
        </div>
      )}

      <div className="routes-header">
        <h3>Assign Trip to Driver</h3>

        <button
          type="button"
          className="primary-btn"
          onClick={() => setShowTripForm(!showTripForm)}
        >
          <Plus size={16} />
          Assign Trip
        </button>
      </div>

      {showTripForm && (
        <div className="admin-form-box">
          <h3>Assign New Trip</h3>

          <div className="admin-form-grid">
            <select
              value={tripForm.bus}
              onChange={(e) =>
                setTripForm({
                  ...tripForm,
                  bus: e.target.value,
                  route: "",
                  governorate: "",
                  area: "",
                  availableSeats:
                    buses.find((bus) => bus._id === e.target.value)?.capacity ||
                    "",
                })
              }
            >
              <option value="">Select Bus</option>

              {buses.map((bus) => (
                <option key={bus._id} value={bus._id}>
                  {bus.busNumber} - {bus.busType} - {bus.capacity} seats
                </option>
              ))}
            </select>

            <select
              value={tripForm.driver}
              onChange={(e) =>
                setTripForm({ ...tripForm, driver: e.target.value })
              }
            >
              <option value="">Select Driver</option>

              {drivers.map((driver) => (
                <option key={driver._id} value={driver._id}>
                  {driver.fullName}
                </option>
              ))}
            </select>

            {selectedBusType === "beeyout" && (
              <>
                <select
                  value={tripForm.governorate}
                  onChange={(e) =>
                    setTripForm({
                      ...tripForm,
                      governorate: e.target.value,
                      area: "",
                    })
                  }
                >
                  <option value="">Select Governorate</option>

                  {Object.keys(KUWAIT_GOVERNORATES).map((governorate) => (
                    <option key={governorate} value={governorate}>
                      {governorate}
                    </option>
                  ))}
                </select>

                <select
                  value={tripForm.area}
                  disabled={!tripForm.governorate}
                  onChange={(e) =>
                    setTripForm({ ...tripForm, area: e.target.value })
                  }
                >
                  <option value="">Select Area</option>

                  {(KUWAIT_GOVERNORATES[tripForm.governorate] || []).map(
                    (area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    )
                  )}
                </select>
              </>
            )}

            {selectedBusType === "campus-off" && (
              <select
                value={tripForm.route}
                onChange={(e) =>
                  setTripForm({ ...tripForm, route: e.target.value })
                }
              >
                <option value="">Select Campus-Off Route</option>

                {filteredRoutes.map((route) => (
                  <option key={route._id} value={route._id}>
                    {route.routeName}
                  </option>
                ))}
              </select>
            )}

            {selectedBusType === "college" && (
              <select
                value={tripForm.route}
                onChange={(e) =>
                  setTripForm({ ...tripForm, route: e.target.value })
                }
              >
                <option value="">Select College Route</option>

                {filteredRoutes.map((route) => (
                  <option key={route._id} value={route._id}>
                    {route.routeName}
                  </option>
                ))}
              </select>
            )}

            <input
              type="datetime-local"
              value={tripForm.departureTime}
              onChange={(e) =>
                setTripForm({
                  ...tripForm,
                  departureTime: e.target.value,
                })
              }
            />

            <input
              type="datetime-local"
              value={tripForm.arrivalTime}
              onChange={(e) =>
                setTripForm({
                  ...tripForm,
                  arrivalTime: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Available Seats"
              value={tripForm.availableSeats}
              onChange={(e) =>
                setTripForm({
                  ...tripForm,
                  availableSeats: e.target.value,
                })
              }
            />
          </div>

          <div className="form-buttons-row">
            <button
              type="button"
              className="route-cancel-btn"
              onClick={() => setShowTripForm(false)}
            >
              Cancel
            </button>

            <button
              type="button"
              className="primary-btn"
              onClick={handleAssignTrip}
            >
              Assign Trip
            </button>
          </div>
        </div>
      )}

      <div className="bus-table-section">
        <h3>Buses</h3>

        <table className="simple-table">
          <thead>
            <tr>
              <th>Bus Number</th>
              <th>Type</th>
              <th>Category</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {activeBuses.map((bus) => (
              <tr key={bus._id}>
                <td>{bus.busNumber}</td>

                <td>
                  <span className="badge-blue mini-badge">{bus.busType}</span>
                </td>

                <td>
                  <span className="mini-badge mixed-badge">
                    {bus.genderCategory}
                  </span>
                </td>

                <td>{bus.capacity}</td>

                <td className="actions-cell">
                  <Pencil
                    size={16}
                    className="action-edit"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEditBus(bus)}
                  />

                  <Trash2
                    size={16}
                    className="action-delete"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteBus(bus._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="routes-section">
        <h3>{editingRouteId ? "Edit Route" : "Add Route"}</h3>

        <div className="route-form-grid">
          <input
            placeholder="Route Name"
            value={routeForm.routeName}
            onChange={(e) =>
              setRouteForm({
                ...routeForm,
                routeName: e.target.value,
              })
            }
          />

          <select
            value={routeForm.routeType}
            onChange={(e) =>
              setRouteForm({
                ...routeForm,
                routeType: e.target.value,
              })
            }
          >
            <option value="beeyout">Beeyout</option>
            <option value="campus-off">Campus-Off</option>
            <option value="college">College</option>
          </select>

          <input
            placeholder="Departure Location"
            value={routeForm.departureLocation}
            onChange={(e) =>
              setRouteForm({
                ...routeForm,
                departureLocation: e.target.value,
              })
            }
          />

          <input
            placeholder="Destination"
            value={routeForm.destination}
            onChange={(e) =>
              setRouteForm({
                ...routeForm,
                destination: e.target.value,
              })
            }
          />
        </div>

        <div className="form-buttons-row">
          <button
            type="button"
            className="primary-btn"
            onClick={handleSaveRoute}
          >
            {editingRouteId ? "Update Route" : "Add Route"}
          </button>

          {editingRouteId && (
            <button
              type="button"
              className="route-cancel-btn"
              onClick={resetRouteForm}
            >
              Cancel Edit
            </button>
          )}
        </div>

        <h3>Routes</h3>

        {routes.map((route) => (
          <div key={route._id} className="route-card">
            <div>
              <h4>{route.routeName}</h4>
              <p>
                {route.departureLocation} → {route.destination}
              </p>
              <small>Type: {route.routeType}</small>
            </div>

            <div className="route-actions">
              <span className="route-type">{route.routeType}</span>

              <Pencil
                size={16}
                className="action-edit"
                style={{ cursor: "pointer" }}
                onClick={() => handleEditRoute(route)}
              />

              <Trash2
                size={16}
                className="action-delete"
                style={{ cursor: "pointer" }}
                onClick={() => handleDeleteRoute(route._id)}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BusManagementTab;
