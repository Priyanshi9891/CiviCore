
import { BrowserRouter, Routes, Route } from "react-router-dom";
 import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from './pages/Register';
import AdminDashboard from "./pages/AdminDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import CitizenDashboard from "./pages/CitizenDashboard";
import AdminCreateWorker from "./pages/AdminCreateWorker";
 import ProtectedRoute from "./routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
          <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} /> 
         <Route path="/register" element={<Register />} />
         <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard/></ProtectedRoute>} />
        <Route path="/admin/create-worker" element={<ProtectedRoute role="admin"><AdminCreateWorker/></ProtectedRoute>} />
        <Route path="/worker-dashboard" element={<ProtectedRoute role="worker"><WorkerDashboard/></ProtectedRoute>} />
        <Route path="/citizen-dashboard" element={<ProtectedRoute role="citizen"><CitizenDashboard/></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;