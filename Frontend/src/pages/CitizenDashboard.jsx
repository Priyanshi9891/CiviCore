
import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../utils/notify";

const CitizenDashboard = () => {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [userName, setUserName] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "water",
    location: ""
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || role !== "citizen") {
      navigate("/login");
    } else {
      if (user) setUserName(user.name);
      fetchComplaints();
    }
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints/my");
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("location", form.location);
      if (image) formData.append("image", image);

      await API.post("/complaints/create", formData);

      notifySuccess("Complaint submitted successfully");

      setForm({
        title: "",
        description: "",
        category: "water",
        location: ""
      });

      setImage(null);
      setShowForm(false);
      fetchComplaints();
    } catch (err) {
      notifyError(
        err.response?.data?.msg ||
        err.response?.data?.error ||
        err.message ||
        "Failed to submit complaint"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/complaints/delete/${id}`);
      notifySuccess("Complaint deleted successfully");
      fetchComplaints();
    } catch (err) {
      notifyError(err.response?.data?.msg || "Failed to delete complaint");
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const statusColor = (status) => {
    if (status === "pending") return "secondary";
    if (status === "assigned") return "info";
    if (status === "in-progress") return "warning";
    if (status === "resolved") return "success";
    return "dark";
  };

  return (
    <div className="d-flex">

      {/* ================= Sidebar ================= */}
      <div
        className="bg-dark text-white p-4 position-fixed"
        style={{ width: "250px", height: "100vh" }}
      >
        <div className="text-center mb-4">
          <img src="/logo-city.png" alt="logo" style={{ height: "60px" }} />
          <h4 className="mt-2">CiviCore</h4>
        </div>

        <hr />

        <button
          className="btn btn-success w-100 mb-3"
          onClick={() => setShowForm(true)}
        >
          + Create Complaint
        </button>

        <button
          className="btn btn-danger w-100"
          onClick={logout}
        >
          Logout
        </button>
      </div>

      {/* ================= Main Content ================= */}
      <div
        className="flex-grow-1"
        style={{ marginLeft: "250px" }}
      >

        {/* Top Navbar */}
        <nav className="navbar navbar-light bg-white shadow-sm px-4 py-3">
          <span className="fw-bold fs-4">
            Citizen Dashboard
          </span>

          <div className="d-flex align-items-center">
            <span className="me-3 fw-semibold text-capitalize">
              {userName}
            </span>
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="rounded-circle"
            />
          </div>
        </nav>

        {/* ================= Stats Section ================= */}
        <div className="container mt-4">
          <div className="row g-4 text-center">

            <div className="col-md-3">
              <div className="card shadow-sm p-3 rounded-4">
                <h6>Total</h6>
                <h3>{complaints.length}</h3>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm p-3 rounded-4">
                <h6>Pending</h6>
                <h3>{complaints.filter(c => c.status === "pending").length}</h3>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm p-3 rounded-4">
                <h6>In Progress</h6>
                <h3>{complaints.filter(c => c.status === "in-progress").length}</h3>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm p-3 rounded-4">
                <h6>Resolved</h6>
                <h3>{complaints.filter(c => c.status === "resolved").length}</h3>
              </div>
            </div>

          </div>
        </div>

        {/* ================= Complaint List ================= */}
        <div className="container mt-5">
          <h4 className="mb-4">My Complaints</h4>

          <div className="row g-4">
            {complaints.map(c => (
              <div className="col-md-6" key={c._id}>
                <div className="card shadow-sm rounded-4 h-100">
                  <div className="card-body">
                    <h5 className="fw-bold">{c.title}</h5>

                    {c.image && (
                      <img
                        src={c.image}
                        alt="complaint"
                        className="img-fluid rounded my-3"
                        style={{ maxHeight: "200px", objectFit: "cover" }}
                      />
                    )}

                    <p>{c.description}</p>
                    <p><b>Category:</b> {c.category}</p>
                    <p><b>Location:</b> {c.location}</p>

                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className={`badge bg-${statusColor(c.status)} px-3 py-2 text-capitalize`}>
                        {c.status}
                      </span>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ================= Modal ================= */}
      {showForm && (
        <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content rounded-4">
              <div className="modal-header">
                <h5>Create Complaint</h5>
                <button className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>

              <div className="modal-body">
                <form onSubmit={handleSubmit}>

                  <div className="row">
                    <div className="col-md-6">
                      <label>Title</label>
                      <input
                        className="form-control mb-3"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label>Category</label>
                      <select
                        className="form-select mb-3"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                      >
                        <option value="water">Water</option>
                        <option value="electricity">Electricity</option>
                        <option value="road">Road</option>
                        <option value="garbage">Garbage</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <label>Description</label>
                  <textarea
                    className="form-control mb-3"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />

                  <label>Location</label>
                  <input
                    className="form-control mb-3"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                  />

                  <label>Upload Image</label>
                  <input
                    type="file"
                    className="form-control mb-4"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />

                  <button className="btn btn-success w-100">
                    Submit Complaint
                  </button>

                </form>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CitizenDashboard;