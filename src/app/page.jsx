"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employees_id: "",
    task_name: "",
    due_date: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${API_URL}/tasks`);

      setTasks(response.data);
    } catch (error) {
      console.error("Gagal mengambil tugas:", error);
    }

    setLoading(false);
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}/employees`);

      setEmployees(response.data);
    } catch (error) {
      console.error("Gagal mengambil daftar karyawan:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/tasks/create`, formData);
      setFormData({ employees_id: "", task_name: "", due_date: "" });
      fetchTasks();
    } catch (error) {
      console.error("Gagal menambah tugas:", error);
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus tugas ini?")) {
      try {
        await axios.delete(`${API_URL}/tasks/${id}`);

        setTasks((prevTasks) => prevTasks.filter((task) => task.id != id));
      } catch (error) {
        console.error("Gagal menghapus tugas:", error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-5">Task Management</h2>
      <div className="card p-3 mb-4">
        <h5>Tambah Tugas</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label">Karyawan</label>
            <select
              className="form-control"
              value={formData.employees_id}
              onChange={(e) =>
                setFormData({ ...formData, employees_id: e.target.value })
              }
              required
            >
              <option value="">Pilih Karyawan</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="form-label">Task Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.task_name}
              onChange={(e) =>
                setFormData({ ...formData, task_name: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Due Date</label>
            <input
              type="date"
              className="form-control"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Menambahkan..." : "Tambah"}
          </button>
        </form>
      </div>
      {loading ? (
        <div className="text-center my-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Karyawan</th>
              <th>Task Name</th>
              <th>Due Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>
                  {task.employee ? task.employee.name : "Tidak Diketahui"}
                </td>
                <td>{task.task_name}</td>
                <td>{task.due_date}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(task.id)}
                    disabled={loading}
                  >
                    {loading ? "Menghapus..." : "Hapus"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskManager;
