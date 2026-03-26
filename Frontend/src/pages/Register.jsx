
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../utils/notify";


const Register = () => {
  const [form,setForm] = useState({name:"",email:"",password:""});
  const navigate = useNavigate();

  const handleChange = e => setForm({...form,[e.target.name]:e.target.value});

  const handleSubmit = async e => {
    e.preventDefault();
    await API.post("/auth/register",form);
    notifySuccess("Registered Successfully");
    navigate("/login");
  };

  return (
    <div className="container mt-5">
  <div className="row justify-content-center">
    <div className="col-md-5">
      <div className="card shadow-lg p-4 rounded-4">

        <h3 className="text-center mb-3 fw-bold">Create CiviCore Account</h3>

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
              name="name"
              className="form-control"
              placeholder="Enter your name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
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
              placeholder="Create password"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 py-2"
          >
            Register
          </button>

        </form>

        <div className="text-center mt-3">
          <small>
            Already have an account?{" "}
            <span
              style={{ cursor: "pointer", color: "#0d6efd" }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </small>
        </div>

      </div>
    </div>
  </div>
</div>
  );
};
export default Register;