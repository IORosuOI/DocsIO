import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

export default function EditorPage({ user }) {
    const { id } = useParams()
    const navigate = useNavigate()
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [saved, setSaved] = useState(true)

    useEffect(() => {
        axios.get(`http://localhost:8082/api/documents/${id}`)
            .then(res => {
                setTitle(res.data.title)
                setContent(res.data.content || "")
            })
    }, [id])

    const handleSave = async () => {
        await axios.put(`http://localhost:8082/api/documents/${id}`, {
            title,
            content,
            owner: { id: user.id }
        })
        setSaved(true)
    }

    const handleChange = (val, setter) => {
        setter(val)
        setSaved(false)
    }

    return (
        <div style={styles.container}>
            <div style={styles.topbar}>
                <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>← Back</button>
                <input
                    style={styles.titleInput}
                    value={title}
                    onChange={(e) => handleChange(e.target.value, setTitle)}
                    placeholder="Untitled"
                />
                <button style={styles.saveBtn} onClick={handleSave}>
                    {saved ? "Saved" : "Save"}
                </button>
            </div>
            <textarea
                style={styles.editor}
                value={content}
                onChange={(e) => handleChange(e.target.value, setContent)}
                placeholder="Start writing..."
            />
        </div>
    )
}

const styles = {
    container: { display: "flex", flexDirection: "column", height: "100vh", fontFamily: "sans-serif" },
    topbar: { display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 2rem", borderBottom: "1px solid #e0e0e0", backgroundColor: "white" },
    backBtn: { padding: "0.5rem 1rem", border: "1px solid #ddd", borderRadius: "6px", cursor: "pointer", backgroundColor: "white", color: "black" },
    titleInput: { flex: 1, fontSize: "1.2rem", fontWeight: "bold", border: "none", outline: "none", padding: "0.5rem" },
    saveBtn: { padding: "0.5rem 1.2rem", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
    editor: { flex: 1, padding: "2rem", fontSize: "1rem", border: "none", outline: "none", resize: "none", lineHeight: "1.6", fontFamily: "sans-serif" }
}