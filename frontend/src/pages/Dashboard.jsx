import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function Dashboard({ user, onLogout }) {
    const [activeSection, setActiveSection] = useState("home")
    const [documents, setDocuments] = useState([])
    const [contextMenu, setContextMenu] = useState(null) // {x, y, doc}
    const navigate = useNavigate()

    const fetchDocuments = async () => {
        const res = await axios.get(`http://localhost:8082/api/documents/owner/${user.id}`)
        setDocuments(res.data)
    }

    useState(() => { fetchDocuments() }, [])

    const handleRightClick = (e, doc) => {
        e.preventDefault()
        setContextMenu({ x: e.clientX, y: e.clientY, doc })
    }

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:8082/api/documents/${id}`)
        setContextMenu(null)
        fetchDocuments()
    }

    const handleNewDoc = async () => {
        await axios.post("http://localhost:8082/api/documents", {
            title: "Untitled",
            content: "",
            owner: { id: user.id }
        })
        fetchDocuments()
    }

    return (
        <div style={styles.container} onClick={() => setContextMenu(null)}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <h2 style={styles.logo}>docsIO</h2>
                {["home", "folders", "shared", "trash"].map(section => (
                    <div
                        key={section}
                        style={{ ...styles.sidebarItem, ...(activeSection === section ? styles.sidebarActive : {}) }}
                        onClick={() => setActiveSection(section)}
                    >
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                    </div>
                ))}
                <div style={styles.sidebarBottom}>
                    <div style={styles.sidebarItem} onClick={onLogout}>Logout</div>
                </div>
            </div>

            {/* Main */}
            <div style={styles.main}>
                <div style={styles.topbar}>
                    <input style={styles.search} placeholder="Search..." />
                    <button style={styles.newBtn} onClick={handleNewDoc}>+ New Document</button>
                </div>

                <div style={styles.grid}>
                    {documents.map(doc => (
                        <div
                            key={doc.id}
                            style={styles.card}
                            onContextMenu={(e) => handleRightClick(e, doc)}
                            onClick={() => navigate(`/editor/${doc.id}`)}
                        >
                            <div style={styles.cardTitle}>{doc.title}</div>
                            <div style={styles.cardDate}>{doc.createdAt?.slice(0, 10)}</div>
                        </div>
                    ))}
                    {documents.length === 0 && <p style={{ color: "#888" }}>No documents yet. Create one!</p>}
                </div>
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <div style={{ ...styles.contextMenu, top: contextMenu.y, left: contextMenu.x }}>
                    <div style={styles.contextItem}>Rename</div>
                    <div style={styles.contextItem}>Share</div>
                    <div style={{ ...styles.contextItem, color: "red" }} onClick={() => handleDelete(contextMenu.doc.id)}>Delete</div>
                </div>
            )}
        </div>
    )
}

const styles = {
    container: { display: "flex", height: "100vh", width: "100vw", fontFamily: "sans-serif", position: "relative" },
    sidebar: { width: "200px", backgroundColor: "#1e1e2e", color: "white", display: "flex", flexDirection: "column", padding: "1rem", gap: "0.5rem" },
    logo: { marginBottom: "1rem", fontSize: "1.4rem" },
    sidebarItem: { padding: "0.6rem 1rem", borderRadius: "6px", cursor: "pointer" },
    sidebarActive: { backgroundColor: "#2563eb" },
    sidebarBottom: { marginTop: "auto" },
    main: { flex: 1, padding: "2rem", backgroundColor: "#f9f9f9" },
    topbar: { display: "flex", justifyContent: "space-between", marginBottom: "2rem" },
    search: { padding: "0.6rem 1rem", borderRadius: "6px", border: "1px solid #ddd", width: "300px" },
    newBtn: { padding: "0.6rem 1.2rem", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" },
        card: { backgroundColor: "white", borderRadius: "8px", padding: "1rem", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", border: "1px solid #e0e0e0", cursor: "pointer", minHeight: "120px" },
    cardTitle: { fontWeight: "bold", marginBottom: "0.5rem" },
    cardDate: { fontSize: "0.8rem", color: "#888" },
    contextMenu: { position: "fixed", backgroundColor: "white", border: "1px solid #ddd", borderRadius: "6px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 1000, minWidth: "150px" },
    contextItem: { padding: "0.6rem 1rem", cursor: "pointer" },
}