
import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../utils/notify";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);
         notifySuccess("login successfully!");
      // Save auth data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Role based redirect
      if (res.data.user.role === "admin") {
        setTimeout(() => {
         navigate("/admin-dashboard");
        }, 1000);
      } 
      else if (res.data.user.role === "worker") {
        setTimeout(() => {
          navigate("/worker-dashboard");
        }, 1000);
       
      } 
      else {
        setTimeout(() => {
          navigate("/citizen-dashboard");
        }, 1000);
        
      }

    } catch (err) {
      notifyError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
     
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card shadow-lg p-4 rounded-4">
              <h3 className="text-center mb-3 fw-bold">Login to CiviCore</h3>
              
              <img src="logo-city.png" style={{ height: "100px" , maxWidth: "100%", objectFit: "contain" }}></img>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter email"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter password"
                    onChange={handleChange}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100 py-2"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="text-center mt-3">
                <small>
                  Don't have an account?{" "}
                  <span
                    style={{ cursor: "pointer", color: "#0d6efd" }}
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </span>
                </small>
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;