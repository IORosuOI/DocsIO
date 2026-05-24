import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import AuthLayout from "../components/AuthLayout.jsx"
import styles from "../styles/auth.styles.js"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) { setError("Please fill in all fields"); return }
    if (password !== confirm) { setError("Passwords do not match"); return }
    setLoading(true); setError("")
    try {
      await axios.post("http://localhost:8082/api/users/register", { username, email, password })
      navigate("/login")
    } catch (e) {
      setError("Registration failed — username or email already taken")
    } finally {
      setLoading(false)
    }
  }

  return (
      <AuthLayout tagline="Create your account and start organizing your thoughts in seconds.">
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Create account</h2>
          <p style={styles.cardSubtitle}>Get started with your workspace in seconds.</p>

          <label style={styles.label}>Username</label>
          <input style={styles.input} placeholder="your.username" value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 onKeyDown={(e) => e.key === "Enter" && handleRegister()} />

          <label style={styles.label}>Email</label>
          <input style={styles.input} placeholder="you@example.com" value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 onKeyDown={(e) => e.key === "Enter" && handleRegister()} />

          <label style={styles.label}>Password</label>
          <input style={styles.input} placeholder="••••••••" type="password" value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 onKeyDown={(e) => e.key === "Enter" && handleRegister()} />

          <label style={styles.label}>Confirm password</label>
          <input style={styles.input} placeholder="••••••••" type="password" value={confirm}
                 onChange={(e) => setConfirm(e.target.value)}
                 onKeyDown={(e) => e.key === "Enter" && handleRegister()} />

          {error && <p style={styles.error}>{error}</p>}

          <button style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
                  onClick={handleRegister} disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>

          <p style={styles.link}>
            Already have an account? <Link to="/login" style={styles.linkAnchor}>Sign in</Link>
          </p>
        </div>
      </AuthLayout>
  )
}