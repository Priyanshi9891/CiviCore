
import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../utils/notify";
const AdminCreateWorker = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
       await API.post("/admin/create-worker", form);
       notifySuccess("Worker created successfully!");
      navigate("/admin-dashboard");

    } catch (err) {
      notifyError(err.response?.data?.msg || "Failed to create worker");
    }
  };

   return (
  <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card shadow-lg p-4 rounded-4">

          <h3 className="text-center mb-3 fw-bold">
            Create Worker Account
          </h3>

          <div className="text-center mb-3">
            <img
              src="/logo-city.png"
              alt="CiviCore Logo"
              className="img-fluid"
              style={{
                height: "100px",
                objectFit: "contain"
              }}
            />
          </div>

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Enter worker name"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Enter worker email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Create password"
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-success w-100 py-2">
              Create Worker
            </button>

          </form>

        </div>
      </div>
    </div>
  </div>

  );
};

export default AdminCreateWorker;