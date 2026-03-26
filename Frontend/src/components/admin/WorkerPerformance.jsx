import React, { useEffect, useState } from "react";
import API from "../../services/api";

const WorkerPerformance = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      const res = await API.get("/admin/worker-performance");
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h4 className="mb-3">Worker Performance</h4>

      <div className="card shadow p-3 rounded-4">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Assigned</th>
              <th>Resolved</th>
              <th>Completion %</th>
            </tr>
          </thead>
          <tbody>
            {data.map(worker => (
              <tr key={worker._id}>
                <td>{worker.name}</td>
                <td>{worker.assigned}</td>
                <td>{worker.resolved}</td>
                <td>{worker.completionRate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkerPerformance;