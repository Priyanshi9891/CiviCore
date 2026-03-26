

import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { notifyError } from "../utils/notify";
import ChatBox from "../components/admin/ChatBox";

const API = "http://localhost:5000/api";

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [chatComplaint, setChatComplaint] = useState(null);

  const token = localStorage.getItem("token");
  const worker = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/complaints/worker`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load tasks");
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${API}/complaints/status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (err) {
      notifyError("Status update failed");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    resolved: tasks.filter(t => t.status === "resolved").length
  };

  return (
    <div>
      {/* ================= SIDEBAR ================= */}
      <div
        className="bg-dark text-white p-3 position-fixed"
        style={{
          width: "250px",
          height: "100vh",
          top: 0,
          left: 0
        }}
      >
        <h4 className="d-flex align-items-center">
          <img
            src="/logo-city.png"
            alt="logo"
            style={{ height: "40px", marginRight: "10px" }}
          />
          CiviCore
        </h4>
        <hr />
        <button
          className="btn btn-danger w-100 mt-3"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* ================= MAIN AREA ================= */}
      <div style={{ marginLeft: "250px" }}>

        {/* ================= FIXED NAVBAR ================= */}
        <nav
          className="navbar navbar-light bg-white shadow-sm px-4 position-fixed w-100"
          style={{
            top: 0,
            left: "250px",
            height: "70px",
            zIndex: 1000
          }}
        >
          <span className="navbar-brand fw-bold fs-5">
            Welcome, {worker?.name || "Worker"}
          </span>

          <div className="d-flex align-items-center">
            <span className="me-2 fw-semibold text-capitalize">
              {worker?.name}
            </span>
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="rounded-circle"
            />
          </div>
        </nav>

        {/* ================= PAGE CONTENT ================= */}
        <div
          className="bg-light"
          style={{
            marginTop: "70px",
            padding: "20px",
            minHeight: "100vh"
          }}
        >

          {/* ================= STATS ================= */}
          <div className="container">
            <div className="row text-center">
              <div className="col-md-4">
                <div className="card p-3 shadow-sm">
                  Total Tasks <br />
                  <b>{stats.total}</b>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card p-3 shadow-sm">
                  In Progress <br />
                  <b>{stats.inProgress}</b>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card p-3 shadow-sm">
                  Resolved <br />
                  <b>{stats.resolved}</b>
                </div>
              </div>
            </div>
          </div>

          {/* ================= TASKS ================= */}
          <div className="container mt-4">
            <h4>Assigned Complaints</h4>

            {loading && <div className="text-center">Loading...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            {!loading && tasks.length === 0 && (
              <div className="alert alert-info">No tasks assigned</div>
            )}

            <div className="row">
              {tasks.map(task => (
                <div className="col-md-6" key={task._id}>
                  <div className="card shadow-sm mb-3">
                    <div className="card-body">
                      <h5>{task.title}</h5>
                      <p>{task.description}</p>

                      <p><b>Citizen:</b> {task.citizen?.name}</p>
                      <p><b>Location:</b> {task.location}</p>

                      <span className={`badge ${
                        task.status === "resolved"
                          ? "bg-success"
                          : task.status === "in-progress"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}>
                        {task.status}
                      </span>

                      <div className="mt-3">
                        {task.status !== "in-progress" && (
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() =>
                              updateStatus(task._id, "in-progress")
                            }
                          >
                            Start
                          </button>
                        )}

                        {task.status !== "resolved" && (
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() =>
                              updateStatus(task._id, "resolved")
                            }
                          >
                            Resolve
                          </button>
                        )}

                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => setChatComplaint(task)}
                        >
                          Open Chat
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= CHAT SECTION ================= */}
          {chatComplaint && (
            <div className="container mt-4">
              <div className="card shadow">
                <div className="card-header d-flex justify-content-between">
                  <span>
                    Chat for: <b>{chatComplaint.title}</b>
                  </span>
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
    </div>
  );
}