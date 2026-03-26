import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark px-4" style={{ backgroundColor: "#172448" }} >
       <img src="logo-city.png" style={{ height: "60px" }}></img>
        <span className="navbar-brand fw-bold fs-4">CiviCore</span> 
        <div className="ms-auto"> <button onClick={() => navigate("/login")} className="btn btn-outline-light me-2" > Login </button> 
        <button onClick={() => navigate("/register")} className="btn btn-primary" > Register </button> 
        </div>
    </nav>
  );
};

export default Navbar;

