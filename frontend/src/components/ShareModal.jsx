import { useState, useEffect } from "react"
import axios from "axios"
import styles from "../styles/dashboard.styles.js"

export default function ShareModal({ doc, currentUser, onClose }) {
    const [username, setUsername] = useState("")
    const [accessLevel, setAccessLevel] = useState("READ")
    const [permissions, setPermissions] = useState([])
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    useEffect(() => {
        axios.get(`http://localhost:8082/api/permissions/document/${doc.id}`)
            .then(res => setPermissions(res.data))
    }, [doc.id])

    const handleShare = async () => {
        if (!username.trim()) { setError("Enter a username"); return }
        setError(""); setSuccess("")
        try {
            await axios.post("http://localhost:8082/api/permissions/share", {
                username,
                documentId: String(doc.id),
                accessLevel
            })
            setSuccess(`Shared with ${username}`)
            setUsername("")
            const res = await axios.get(`http://localhost:8082/api/permissions/document/${doc.id}`)
            setPermissions(res.data)
        } catch (e) {
            setError(
                e.response?.status === 404 ? "User not found" :
                    e.response?.status === 400 ? e.response.data :
                        "Failed to share"
            )
        }
    }

    const handleRevoke = async (permId) => {
        await axios.delete(`http://localhost:8082/api/permissions/${permId}`)
        setPermissions(prev => prev.filter(p => p.id !== permId))
    }

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={{ ...styles.modal, maxWidth: "480px" }} onClick={(e) => e.stopPropagation()}>
                <h2 style={styles.modalTitle}>Share "{doc.title}"</h2>
                <p style={styles.modalText}>Invite others to view or edit this document.</p>

                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                    <input
                        style={{ ...styles.renameInput, flex: 1 }}
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleShare()}
                    />
                    <select
                        value={accessLevel}
                        onChange={(e) => setAccessLevel(e.target.value)}
                        style={{ padding: "0.75rem", borderRadius: "12px", border: "1px solid #d1d5db", fontSize: "0.9rem" }}
                    >
                        <option value="READ">Read</option>
                        <option value="EDIT">Edit</option>
                    </select>
                </div>

                {error && <p style={{ color: "#dc2626", fontSize: "0.9rem", margin: "0 0 0.5rem" }}>{error}</p>}
                {success && <p style={{ color: "#059669", fontSize: "0.9rem", margin: "0 0 0.5rem" }}>{success}</p>}

                <button style={styles.saveBtn} onClick={handleShare}>Share</button>

                {permissions.length > 0 && (
                    <div style={{ marginTop: "1.5rem" }}>
                        <p style={{ fontWeight: 700, marginBottom: "0.5rem", color: "#374151" }}>Shared with</p>
                        {permissions.map(p => (
                            <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #f3f4f6" }}>
                                <span style={{ fontSize: "0.95rem" }}>{p.user?.username}</span>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span style={{ fontSize: "0.8rem", color: "#6b7280", backgroundColor: "#f3f4f6", padding: "0.2rem 0.6rem", borderRadius: "999px" }}>{p.accessLevel}</span>
                                    <button
                                        onClick={() => handleRevoke(p.id)}
                                        style={{ border: "none", background: "none", color: "#dc2626", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem" }}
                                    >✕</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ ...styles.modalActions, marginTop: "1.5rem" }}>
                    <button style={styles.cancelBtn} onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    )
}