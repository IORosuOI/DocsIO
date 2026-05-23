import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useState } from "react"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import Dashboard from "./pages/Dashboard"
import EditorPage from "./pages/EditorPage"

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={(user) => setCurrentUser(user)} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={currentUser ? <Dashboard user={currentUser} onLogout={() => setCurrentUser(null)} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/editor/:id" element={currentUser ? <EditorPage user={currentUser} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}