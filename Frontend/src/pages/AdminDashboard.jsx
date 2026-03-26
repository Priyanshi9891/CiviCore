

import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import WorkerPerformance from "../components/admin/WorkerPerformance";
import ChatBox from "../components/admin/ChatBox"; // ✅ Import ChatBox
import { notifySuccess, notifyError } from "../utils/notify";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [adminName, setAdminName] = useState("");
  const [selectedWorker, setSelectedWorker] = useState("");
  const [selectedComplaint, setSelectedComplaint] = useState(null); // Assign modal
  const [chatComplaint, setChatComplaint] = useState(null); // ✅ Chat state

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || role !== "admin") {
      navigate("/login");
    } else {
      if (user) {
        setAdminName(user.name);
      }
      fetchComplaints();
      fetchWorkers();
    }
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints/all");
      setComplaints(res.data);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  const fetchWorkers = async () => {
    try {
      const res = await API.get("/admin/workers");
      setWorkers(res.data || []);
    } catch (err) {
      setWorkers([]);
    }
  };

  const assignWorker = async () => {
    if (!selectedWorker) {
      alert("Please select a worker");
      return;
    }

    try {
      await API.put(`/complaints/assign/${selectedComplaint._id}`, {
        workerId: selectedWorker
      });
      notifySuccess("Worker assigned successfully");
      setSelectedComplaint(null);
      setSelectedWorker("");
      fetchComplaints();
    } catch (err) {
      notifyError("Assignment failed");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "pending").length,
    assigned: complaints.filter(c => c.status === "assigned").length,
    resolved: complaints.filter(c => c.status === "resolved").length
  };

  const statusColor = status => {
    if (status === "pending") return "secondary";
    if (status === "assigned") return "info";
    if (status === "in-progress") return "warning";
    if (status === "resolved") return "success";
    return "dark";
  };

  return (
  <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>

    {/* ===== Sidebar (Fixed) ===== */}
    <div
      className="bg-dark text-white p-3"
      style={{
        width: "250px",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0
      }}
    >
      <h3 className="d-flex align-items-center">
        <img src="/logo-city.png" style={{ height: "50px" }} alt="logo" />
        <span className="ms-2">CiviCore</span>
      </h3>
      <hr />

      <button
        className="btn btn-success w-100 mb-2"
        onClick={() => navigate("/admin/create-worker")}
      >
        + Create Worker
      </button>

      <button
        className="btn btn-danger w-100 mt-3"
        onClick={logout}
      >
        Logout
      </button>
    </div>

    {/* ===== Main Section ===== */}
    <div
      style={{
        marginLeft: "250px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100vh"
      }}
    >

      {/* ===== Navbar (Fixed) ===== */}
      <nav
        className="navbar navbar-light bg-light shadow-sm px-4"
        style={{
          position: "fixed",
          top: 0,
          left: "250px",
          right: 0,
          height: "70px",
          zIndex: 1000
        }}
      >
        <span className="navbar-brand fw-bold fs-4">
          Welcome, Priyanshu
        </span>
        <div className="d-flex align-items-center">
          <span className="me-2 fw-semibold text-capitalize">
            Priyanshu
          </span>
          <img
            src="https://i.pravatar.cc/40"
            alt="Profile"
            className="rounded-circle"
          />
        </div>
      </nav>

      {/* ===== Scrollable Content ===== */}
      <div
        style={{
          marginTop: "70px",
          padding: "20px",
          overflowY: "auto",
          height: "calc(100vh - 70px)"
        }}
      >

        {/* ===== Stats Section ===== */}
        <div className="container">
           <div className="row text-center">
             <div className="col-md-3">
              <div className="card shadow p-3 rounded-4">
                Total <h4>{stats.total}</h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow p-3 rounded-4">
                Pending <h4>{stats.pending}</h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow p-3 rounded-4">
                Assigned <h4>{stats.assigned}</h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card shadow p-3 rounded-4">
                Resolved <h4>{stats.resolved}</h4>
              </div>
            </div>
          </div>
        </div>

        <WorkerPerformance />

        {/* ===== Complaint List ===== */}
        <div className="container mt-4">
          <h4 className="mb-3">All Complaints</h4>

          <div className="row">
            {complaints.map((c) => (
              <div className="col-md-6" key={c._id}>
                <div className="card shadow-sm mb-3 rounded-4">
                  <div className="card-body">
                    <h5 className="fw-bold">{c.title}</h5>
                    <p>{c.description}</p>
                    <p><b>Citizen:</b> {c.citizen?.name}</p>
                    <p><b>Location:</b> {c.location}</p>

                    <span className={`badge bg-${statusColor(c.status)}`}>
                      {c.status}
                    </span>

                    <button
                      className="btn btn-outline-secondary btn-sm ms-2"
                      onClick={() => setChatComplaint(c)}
                    >
                      Open Chat
                    </button>

                    {!c.worker && (
                      <button
                        className="btn btn-primary btn-sm float-end"
                        onClick={() => setSelectedComplaint(c)}
                      >
                        Assign Worker
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Chat Section ===== */}
        {chatComplaint && (
          <div className="container mt-4">
            <div className="card shadow">
              <div className="card-header d-flex justify-content-between">
                <span>Chat for: {chatComplaint.title}</span>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => setChatComplaint(null)}
                >
                  Close
                </button>
              </div>

              <div className="card-body">
                <ChatBox complaintId={chatComplaint._id} />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>

    {/* ===== Assign Worker Modal ===== */}
    {selectedComplaint && (
      <div
        className="modal show d-block"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2000
        }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Assign Worker</h5>
              <button
                className="btn-close"
                onClick={() => setSelectedComplaint(null)}
              />
            </div>

            <div className="modal-body">
              <select
                className="form-select"
                value={selectedWorker}
                onChange={(e) => setSelectedWorker(e.target.value)}
              >
                <option value="">Select Worker</option>
                {workers.map((w) => (
                  <option key={w._id} value={w._id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedComplaint(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={assignWorker}
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

  </div>
);
};

export default AdminDashboard;