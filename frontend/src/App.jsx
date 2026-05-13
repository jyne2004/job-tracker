import { useState, useEffect } from "react"
import "./App.css"

function App() {
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [jobs, setJobs] = useState([])
  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "applied",
    date_applied: "",
    notes: ""
  })

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = () => {
    fetch("http://localhost:8000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data))
  }

  const handleSubmit = () => {
    fetch("http://localhost:8000/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(res => res.json())
      .then(() => {
        fetchJobs()
        setForm({ company: "", role: "", status: "applied", date_applied: "", notes: "" })
      })
  }

  const deleteJob = (id) => {
    fetch(`http://localhost:8000/jobs/${id}`, {
      method: "DELETE"
    }).then(() => fetchJobs())
  }

  const updateJob = (id) => {
    fetch(`http://localhost:8000/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm)
    }).then(() => {
      fetchJobs()
      setEditingId(null)
    })
  }

  return (
    <div className="container">
      <h1>Job Tracker</h1>

      <div className="form-card">
        <h2>Add Application</h2>
        <input placeholder="Company" value={form.company}
          onChange={e => setForm({...form, company: e.target.value})} />
        <input placeholder="Role" value={form.role}
          onChange={e => setForm({...form, role: e.target.value})} />
        <select value={form.status}
          onChange={e => setForm({...form, status: e.target.value})}>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
        <input type="date" value={form.date_applied}
          onChange={e => setForm({...form, date_applied: e.target.value})} />
        <input placeholder="Notes (optional)" value={form.notes}
          onChange={e => setForm({...form, notes: e.target.value})} />
        <button onClick={handleSubmit}>Add Job</button>
      </div>

  {jobs.map(job => (
    <div key={job.id} className="job-card">
      {editingId === job.id ? (
        <div className="edit-form">
          <input value={editForm.company}
            onChange={e => setEditForm({...editForm, company: e.target.value})} />
          <input value={editForm.role}
            onChange={e => setEditForm({...editForm, role: e.target.value})} />
          <select value={editForm.status}
            onChange={e => setEditForm({...editForm, status: e.target.value})}>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
          <div style={{display: "flex", gap: "8px"}}>
            <button className="save-btn" onClick={() => updateJob(job.id)}>Save</button>
            <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="job-info">
            <h2>{job.company}</h2>
            <p>{job.role}</p>
          </div>
          <div style={{display: "flex", gap: "8px", alignItems: "center"}}>
            <span className={`status-badge status-${job.status}`}>
              {job.status}
            </span>
            <button className="edit-btn" onClick={() => {
              setEditingId(job.id)
              setEditForm({
                company: job.company,
                role: job.role,
                status: job.status,
                date_applied: job.date_applied,
                notes: job.notes
              })
            }}>Edit</button>
            <button className="delete-btn" onClick={() => deleteJob(job.id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  ))}
    </div>
  )
}

export default App