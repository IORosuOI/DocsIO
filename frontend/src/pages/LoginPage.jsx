import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import AuthLayout from "../components/AuthLayout.jsx"
import styles from "../styles/auth.styles.js"

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) { setError("Please fill in both fields"); return }
    setLoading(true); setError("")
    try {
      const res = await axios.post("http://localhost:8082/api/users/login", { username, password })
      onLogin(res.data)
      navigate("/dashboard")
    } catch (e) {
      setError("Invalid username or password")
    } finally {
      setLoading(false)
    }
  }

  return (
      <AuthLayout tagline="Your minimalist workspace for notes, ideas, and documents.">
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Welcome back</h2>
          <p style={styles.cardSubtitle}>Sign in to continue to your workspace.</p>

          <label style={styles.label}>Username</label>
          <input style={styles.input} placeholder="your.username" value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 onKeyDown={(e) => e.key === "Enter" && handleLogin()} />

          <label style={styles.label}>Password</label>
          <input style={styles.input} placeholder="••••••••" type="password" value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 onKeyDown={(e) => e.key === "Enter" && handleLogin()} />

          {error && <p style={styles.error}>{error}</p>}

          <button style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
                  onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p style={styles.link}>
            No account? <Link to="/register" style={styles.linkAnchor}>Create one</Link>
          </p>
        </div>
      </AuthLayout>
  )
}