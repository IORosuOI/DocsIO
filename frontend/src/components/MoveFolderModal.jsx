import { useState, useEffect } from "react"
import axios from "axios"
import styles from "../styles/dashboard.styles.js"

export default function MoveFolderModal({ doc, user, onClose, onMoved }) {
    const [folders, setFolders] = useState([])

    useEffect(() => {
        axios.get(`http://localhost:8082/api/folders/owner/${user.id}`)
            .then(res => setFolders(res.data))
    }, [])

    const handleMove = async (folderId) => {
        await axios.put(`http://localhost:8082/api/documents/${doc.id}/move/${folderId}`)
        onMoved()
        onClose()
    }

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2 style={styles.modalTitle}>Move to folder</h2>
                <p style={styles.modalText}>Select a folder for "{doc.title}"</p>
                {folders.length === 0 && <p style={styles.emptyText}>No folders yet.</p>}
                {folders.map(folder => (
                    <div
                        key={folder.id}
                        style={{ padding: "0.75rem", cursor: "pointer", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem" }}
                        onClick={() => handleMove(folder.id)}
                    >
                        <span>📁</span>
                        <span>{folder.name}</span>
                    </div>
                ))}
                <div style={styles.modalActions}>
                    <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}