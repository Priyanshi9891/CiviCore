
import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { notifySuccess, notifyError } from "../utils/notify";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div>
      {/* Navbar */}
      <Navbar/>
      {/* Hero Section */}
      <section
  className="text-white text-center d-flex align-items-center"
  style={{
    backgroundImage: "url('/homepage.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "55vh",
    position: "relative"
  }}
>
  {/* Dark Overlay */}
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.6)"
    }}
  ></div>

  <div className="container position-relative">
    <h1 className="display-4 fw-bold">Smart City Service Platform</h1>
    <p className="lead mt-3">
      Report issues • Track complaints • Faster resolutions
    </p>

    <div className="mt-4">
      <button
        onClick={() => navigate("/register")}
        className="btn btn-primary btn-lg me-3"
      >
        Get Started
      </button>

      <button
        onClick={() => navigate("/login")}
        className="btn btn-outline-light btn-lg"
      >
        Login
      </button>
    </div>
  </div>
</section>

      {/* Features */}
      <section className="container py-5">
        <div className="row text-center">
          <div className="col-md-3">
            <div className="card shadow p-3">
              <h4>💧 Water</h4>
              <p>Leakage, supply issues</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow p-3">
              <h4>⚡ Electricity</h4>
              <p>Power cuts, faults</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow p-3">
              <h4>🛣 Roads</h4>
              <p>Potholes, damage</p>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow p-3">
              <h4>🗑 Waste</h4>
              <p>Garbage management</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h2 className="mb-4">How It Works</h2>
          <div className="row">
            <div className="col-md-4">
              <div className="card p-3 shadow">
                <h5>1. Register</h5>
                <p>Create account as citizen</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-3 shadow">
                <h5>2. Submit Complaint</h5>
                <p>Report city issues</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card p-3 shadow">
                <h5>3. Track Status</h5>
                <p>Live resolution updates</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="container py-5">
        <div className="row text-center">
          <div className="col-md-4">
            <div className="card shadow p-4">
              <h4>👤 Citizen</h4>
              <p>Report problems & track progress</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow p-4">
              <h4>👷 Worker</h4>
              <p>Resolve assigned tasks</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow p-4">
              <h4>👑 Admin</h4>
              <p>Manage city services</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-dark text-white text-center py-5">
        <h2>Join CiviCore Today</h2>
        <p className="lead">Be part of a smarter city</p>
        <button
          onClick={() => navigate("/register")}
          className="btn btn-success btn-lg"
        >
          Create Account
        </button>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Landing;