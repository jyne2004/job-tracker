import { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login";
import toast, { Toaster } from "react-hot-toast";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
 
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
 
function App() {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "applied",
    date_applied: "",
    notes: "",
  });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
 
  useEffect(() => {
    if (isLoggedIn) {
      fetchJobs();
    }
  }, []);

 
  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);
 
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };
 
  const fetchJobs = () => {
    fetch(`${API}/jobs`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setJobs(data));
  };
 
  const handleSubmit = () => {
    if (!form.company || !form.role) {
      toast.error("Company and role are required!");
      return;
    }
    fetch(`${API}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then(() => {
        fetchJobs();
        setForm({
          company: "",
          role: "",
          status: "applied",
          date_applied: "",
          notes: "",
        });
        toast.success("Job added!");
      });
  };
 
  const deleteJob = (id) => {
    fetch(`${API}/jobs/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(() => {
      fetchJobs();
      toast.success("Job deleted!");
    });
  };
 
  const updateJob = (id) => {
    fetch(`${API}/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(editForm),
    }).then(() => {
      fetchJobs();
      setEditingId(null);
      toast.success("Job updated!");
    });
  };
 
  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === "applied").length,
    interview: jobs.filter((j) => j.status === "interview").length,
    offer: jobs.filter((j) => j.status === "offer").length,
    rejected: jobs.filter((j) => j.status === "rejected").length,
  };
 
  const filteredJobs = jobs
    .filter((job) => {
      const matchesSearch =
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.role.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || job.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.date_applied) - new Date(a.date_applied);
      } else {
        return new Date(a.date_applied) - new Date(b.date_applied);
      }
    });
 
  const chartData = [
    { name: "Applied", value: stats.applied, color: "#3b82f6" },
    { name: "Interview", value: stats.interview, color: "#f59e0b" },
    { name: "Offer", value: stats.offer, color: "#22c55e" },
    { name: "Rejected", value: stats.rejected, color: "#ef4444" },
  ].filter((d) => d.value > 0);
 
  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }
 
  return (
    <div className="container">
      <Toaster position="top-right" />
      <div className="header">
        <h1>Job Tracker</h1>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="dark-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button className="dark-toggle" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
 
      <div className="stats-bar">
        <div className="stat-card">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card">
          <span className="stat-number" style={{ color: "#1d4ed8" }}>
            {stats.applied}
          </span>
          <span className="stat-label">Applied</span>
        </div>
        <div className="stat-card">
          <span className="stat-number" style={{ color: "#854d0e" }}>
            {stats.interview}
          </span>
          <span className="stat-label">Interviews</span>
        </div>
        <div className="stat-card">
          <span className="stat-number" style={{ color: "#166534" }}>
            {stats.offer}
          </span>
          <span className="stat-label">Offers</span>
        </div>
        <div className="stat-card">
          <span className="stat-number" style={{ color: "#991b1b" }}>
            {stats.rejected}
          </span>
          <span className="stat-label">Rejected</span>
        </div>
      </div>
 
      <div className="search-bar">
        <input
          placeholder="Search by company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
 
      {jobs.length > 0 && (
        <div className="chart-card">
          <h2>Applications Overview</h2>
          <PieChart width={300} height={250}>
            <Pie
              data={chartData}
              cx={145}
              cy={110}
              outerRadius={90}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} stroke="#ccc" />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      )}
 
      <div className="form-card">
        <h2>Add Application</h2>
        <input
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
        <input
          placeholder="Role"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
        <input
          type="date"
          value={form.date_applied}
          onChange={(e) => setForm({ ...form, date_applied: e.target.value })}
        />
        <input
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <button onClick={handleSubmit}>Add Job</button>
      </div>
 
      {filteredJobs.length === 0 && (
        <div className="empty-state">
          <p>No jobs found. Add your first application above!</p>
        </div>
      )}
 
      {filteredJobs.map((job) => (
        <div key={job.id} className="job-card">
          {editingId === job.id ? (
            <div className="edit-form">
              <input
                value={editForm.company}
                onChange={(e) =>
                  setEditForm({ ...editForm, company: e.target.value })
                }
              />
              <input
                value={editForm.role}
                onChange={(e) =>
                  setEditForm({ ...editForm, role: e.target.value })
                }
              />
              <select
                value={editForm.status}
                onChange={(e) =>
                  setEditForm({ ...editForm, status: e.target.value })
                }
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
              <div style={{ display: "flex", gap: "8px" }}>
                <button className="save-btn" onClick={() => updateJob(job.id)}>
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="job-info">
                <h2>{job.company}</h2>
                <p>{job.role}</p>
              </div>
              <div
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                <span className={`status-badge status-${job.status}`}>
                  {job.status}
                </span>
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingId(job.id);
                    setEditForm({
                      company: job.company,
                      role: job.role,
                      status: job.status,
                      date_applied: job.date_applied,
                      notes: job.notes,
                    });
                  }}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteJob(job.id)}
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
 
export default App;
 