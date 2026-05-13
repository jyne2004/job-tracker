import { useState } from "react"

function Login({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (isRegister) {
    const res = await fetch("https://job-tracker-backend-tx0d.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      if (res.ok) {
        setIsRegister(false)
        setError("Registered! Please log in.")
      } else {
        setError("Registration failed — email may already exist")
      }
    } else {
      const formData = new URLSearchParams()
      formData.append("username", email)
      formData.append("password", password)
      const res = await fetch("https://job-tracker-backend-tx0d.onrender.com/login", {
        method: "POST",
        body: formData
      })
      if (res.ok) {
        const data = await res.json()
        localStorage.setItem("token", data.access_token)
        onLogin()
      } else {
        setError("Invalid email or password")
      }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Job Tracker</h1>
        <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
        {error && <p className="auth-error">{error}</p>}
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={handleSubmit}>
          {isRegister ? "Register" : "Login"}
        </button>
        <p className="auth-switch">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <span onClick={() => { setIsRegister(!isRegister); setError("") }}>
            {isRegister ? " Login" : " Register"}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Login