import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8082/api/users/login", {
        username,
        password,
      })
      onLogin(res.data)
      navigate("/dashboard")
    } catch (e) {
      setError("Invalid credentials")
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>docsIO</h1>
      <div style={styles.card}>
        <h2>Login</h2>
        <input style={styles.input} placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input style={styles.input} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.button} onClick={handleLogin}>Login</button>
        <p style={styles.link}>No account? <a href="/register">Register</a></p>
      </div>
    </div>
  )
}

const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#f5f5f5" },
  title: { fontSize: "2rem", marginBottom: "1rem", fontWeight: "bold" },
  card: { backgroundColor: "white", padding: "2rem", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "1rem", width: "320px" },
  input: { padding: "0.75rem", borderRadius: "6px", border: "1px solid #ddd", fontSize: "1rem" },
  button: { padding: "0.75rem", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "6px", fontSize: "1rem", cursor: "pointer" },
  error: { color: "red", margin: 0 },
  link: { textAlign: "center", margin: 0 }
}