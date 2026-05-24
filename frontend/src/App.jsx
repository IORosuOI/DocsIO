import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import Dashboard from "./pages/Dashboard"
import EditorPage from "./pages/EditorPage"

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("docsio_user")
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (currentUser) localStorage.setItem("docsio_user", JSON.stringify(currentUser))
    else localStorage.removeItem("docsio_user")
  }, [currentUser])

  const handleLogin = (user) => setCurrentUser(user)
  const handleLogout = () => setCurrentUser(null)

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={currentUser ? <Navigate to="/dashboard" /> : <RegisterPage />} />
          <Route path="/dashboard" element={currentUser ? <Dashboard user={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/editor/:id" element={currentUser ? <EditorPage user={currentUser} /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
  )
}