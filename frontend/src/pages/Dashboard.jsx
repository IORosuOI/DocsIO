import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const sections = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "folders", label: "Folders", icon: "📁" },
    { id: "notes", label: "My Notes", icon: "📝" },
    { id: "shared", label: "Shared", icon: "👥" },
    { id: "trash", label: "Trash", icon: "🗑️" },
]

export default function Dashboard({ user, onLogout }) {
    const [activeSection, setActiveSection] = useState("home")
    const [documents, setDocuments] = useState([])
    const [contextMenu, setContextMenu] = useState(null)
    const [renameModal, setRenameModal] = useState(null)
    const [renameTitle, setRenameTitle] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const navigate = useNavigate()

    const fetchDocuments = async () => {
        const res = await axios.get(`http://localhost:8082/api/documents/owner/${user.id}`)
        setDocuments(res.data)
    }

    useEffect(() => {
        fetchDocuments()
    }, [])

    const visibleDocuments = useMemo(() => {
        let sectionDocs = []

        if (activeSection === "home" || activeSection === "notes") {
            sectionDocs = documents.filter(doc => !doc.deleted)
        }

        if (activeSection === "trash") {
            sectionDocs = documents.filter(doc => doc.deleted === true)
        }

        if (activeSection === "shared" || activeSection === "folders") {
            sectionDocs = []
        }

        if (!searchTerm.trim()) {
            return sectionDocs
        }

        return sectionDocs.filter(doc =>
            (doc.title || "").toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [activeSection, documents, searchTerm])

    const sectionTitle = useMemo(() => {
        if (activeSection === "home") return "Recent Documents"
        if (activeSection === "notes") return "My Notes"
        if (activeSection === "folders") return "Folders"
        if (activeSection === "shared") return "Shared Documents"
        if (activeSection === "trash") return "Trash"
        return "Documents"
    }, [activeSection])

    const handleRightClick = (e, doc) => {
        e.preventDefault()
        e.stopPropagation()
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

    const handleSortByTitle = () => {
        setDocuments(prev =>
            [...prev].sort((a, b) =>
                (a.title || "").localeCompare(b.title || "", undefined, { sensitivity: "base" })
            )
        )
    }

    const handleSortByDate = () => {
        setDocuments(prev =>
            [...prev].sort((a, b) =>
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            )
        )
    }

    const openRenameModal = () => {
        setRenameModal(contextMenu.doc)
        setRenameTitle(contextMenu.doc.title || "")
        setContextMenu(null)
    }

    const closeRenameModal = () => {
        setRenameModal(null)
        setRenameTitle("")
    }

    const handleRenameSave = async () => {
        if (!renameModal) return

        await axios.put(`http://localhost:8082/api/documents/${renameModal.id}`, {
            ...renameModal,
            title: renameTitle,
            owner: renameModal.owner || { id: user.id }
        })

        setDocuments(prev =>
            prev.map(doc =>
                doc.id === renameModal.id ? { ...doc, title: renameTitle } : doc
            )
        )

        closeRenameModal()
    }

    const handleContainerClick = () => {
        setContextMenu(null)
    }

    const getEmptyMessage = () => {
        if (activeSection === "folders") return "Folders are coming soon."
        if (activeSection === "shared") return "No shared documents yet."
        if (activeSection === "trash") return "Trash is empty."
        return "No documents yet. Create one!"
    }

    const getAvatarInitial = () => {
        return user?.username?.trim()?.charAt(0)?.toUpperCase() || "U"
    }

    return (
        <div style={styles.container} onClick={handleContainerClick}>
            <aside style={styles.sidebar}>
                <h2 style={styles.logo}>docsIO</h2>

                <nav style={styles.sidebarNav}>
                    {sections.map(section => (
                        <button
                            key={section.id}
                            type="button"
                            style={{
                                ...styles.sidebarItem,
                                ...(activeSection === section.id ? styles.sidebarActive : {})
                            }}
                            onClick={() => setActiveSection(section.id)}
                        >
                            <span style={styles.sidebarIcon}>{section.icon}</span>
                            {section.label}
                        </button>
                    ))}
                </nav>

                <div style={styles.sidebarBottom}>
                    <div style={styles.userBlock}>
                        <div style={styles.avatar}>{getAvatarInitial()}</div>
                        <div style={styles.username}>{user?.username}</div>
                    </div>
                    <button type="button" style={styles.logoutBtn} onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </aside>

            <main style={styles.main}>
                <div style={styles.topbar}>
                    <div style={styles.topbarSpacer} />
                    <input
                        style={styles.search}
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button style={styles.newBtn} onClick={handleNewDoc}>
                        + New Document
                    </button>
                </div>

                <div style={styles.headerRow}>
                    <div>
                        <h1 style={styles.sectionTitle}>{sectionTitle}</h1>
                        <p style={styles.sectionSubtitle}>
                            Organize and open your docs from one clean workspace.
                        </p>
                    </div>

                    <div style={styles.sortControls}>
                        <button type="button" style={styles.sortBtn} onClick={handleSortByTitle}>
                            Sort by Title
                        </button>
                        <button type="button" style={styles.sortBtn} onClick={handleSortByDate}>
                            Sort by Date
                        </button>
                    </div>
                </div>

                {activeSection === "folders" ? (
                    <div style={styles.comingSoonCard}>
                        <div style={styles.comingSoonIcon}>📁</div>
                        <h2 style={styles.comingSoonTitle}>Coming soon</h2>
                        <p style={styles.emptyText}>Folder organization will be available here.</p>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {visibleDocuments.map(doc => (
                            <article
                                key={doc.id}
                                style={styles.card}
                                onContextMenu={(e) => handleRightClick(e, doc)}
                                onClick={() => navigate(`/editor/${doc.id}`)}
                            >
                                <div style={styles.cardTop}>
                                    <div style={styles.cardTitle}>{doc.title}</div>
                                    <div style={styles.cardMenuHint}>⋯</div>
                                </div>

                                <div style={styles.previewLines}>
                                    <div style={styles.previewText}>
                                        {doc.content
                                            ? doc.content
                                            .replace(/[#>*_`~\-]/g, "")
                                            .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
                                            .replace(/\s+/g, " ")
                                            .trim()
                                            .slice(0, 120) + (doc.content.length > 120 ? "..." : "")
                                            : "Empty document"}
                                    </div>
                                </div>

                                <div style={styles.cardDate}>
                                    {doc.createdAt ? doc.createdAt.slice(0, 10) : "No date"}
                                </div>
                            </article>
                        ))}

                        {visibleDocuments.length === 0 && (
                            <p style={styles.emptyText}>{getEmptyMessage()}</p>
                        )}
                    </div>
                )}
            </main>

            {contextMenu && (
                <div
                    style={{ ...styles.contextMenu, top: contextMenu.y, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button type="button" style={styles.contextItem} onClick={openRenameModal}>
                        Rename
                    </button>
                    <button type="button" style={{ ...styles.contextItem, ...styles.contextDisabled }} disabled>
                        Share
                    </button>
                    <button
                        type="button"
                        style={{ ...styles.contextItem, ...styles.contextDanger }}
                        onClick={() => handleDelete(contextMenu.doc.id)}
                    >
                        Delete
                    </button>
                </div>
            )}

            {renameModal && (
                <div style={styles.modalOverlay} onClick={closeRenameModal}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>Rename document</h2>
                        <p style={styles.modalText}>Update the title for this document.</p>

                        <input
                            style={styles.renameInput}
                            value={renameTitle}
                            onChange={(e) => setRenameTitle(e.target.value)}
                            autoFocus
                            placeholder="Document title"
                        />

                        <div style={styles.modalActions}>
                            <button type="button" style={styles.cancelBtn} onClick={closeRenameModal}>
                                Cancel
                            </button>
                            <button type="button" style={styles.saveBtn} onClick={handleRenameSave}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const styles = {
    container: {
        display: "flex",
        height: "100vh",
        width: "100vw",
        fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: "relative",
        backgroundColor: "#f4f6fb",
        color: "#111827",
        overflow: "hidden"
    },
    sidebar: {
        width: "220px",
        backgroundColor: "#1a1a2e",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: "1.25rem",
        boxSizing: "border-box"
    },
    logo: {
        margin: "0 0 1.5rem",
        fontSize: "1.5rem",
        fontWeight: 800,
        letterSpacing: "-0.04em",
        color: "white"
    },
    sidebarNav: {
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem"
    },
    sidebarItem: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "0.65rem",
        padding: "0.75rem 0.85rem",
        borderRadius: "10px",
        cursor: "pointer",
        border: "none",
        backgroundColor: "transparent",
        color: "#d6d8e8",
        fontSize: "0.95rem",
        textAlign: "left",
        transition: "background-color 0.2s ease, color 0.2s ease"
    },
    sidebarIcon: {
        width: "1.35rem",
        display: "inline-flex",
        justifyContent: "center"
    },
    sidebarActive: {
        backgroundColor: "rgba(255, 255, 255, 0.12)",
        color: "white",
        fontWeight: 700
    },
    sidebarBottom: {
        marginTop: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "0.9rem"
    },
    userBlock: {
        display: "flex",
        alignItems: "center",
        gap: "0.7rem",
        padding: "0.8rem",
        borderRadius: "14px",
        backgroundColor: "rgba(255, 255, 255, 0.08)"
    },
    avatar: {
        width: "34px",
        height: "34px",
        borderRadius: "50%",
        backgroundColor: "#ffffff",
        color: "#1a1a2e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 800,
        fontSize: "0.9rem"
    },
    username: {
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        color: "#f7f7fb",
        fontSize: "0.9rem",
        fontWeight: 600
    },
    logoutBtn: {
        padding: "0.75rem 0.85rem",
        borderRadius: "10px",
        cursor: "pointer",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        backgroundColor: "transparent",
        color: "#f8fafc",
        fontSize: "0.95rem",
        textAlign: "left"
    },
    main: {
        flex: 1,
        padding: "1.5rem 2rem 2rem",
        backgroundColor: "#f4f6fb",
        overflowY: "auto",
        boxSizing: "border-box"
    },
    topbar: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "2rem"
    },
    topbarSpacer: {
        flex: 1
    },
    search: {
        flex: "0 1 520px",
        padding: "0.8rem 1rem",
        borderRadius: "999px",
        border: "1px solid #d9deea",
        backgroundColor: "white",
        color: "#111827",
        fontSize: "0.95rem",
        outline: "none",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)"
    },
    newBtn: {
        padding: "0.8rem 1.25rem",
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "999px",
        cursor: "pointer",
        fontWeight: 700,
        boxShadow: "0 10px 22px rgba(37, 99, 235, 0.22)"
    },
    headerRow: {
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: "1rem",
        marginBottom: "1.25rem"
    },
    sectionTitle: {
        margin: 0,
        color: "#111827",
        fontSize: "1.65rem",
        fontWeight: 800,
        letterSpacing: "-0.03em"
    },
    sectionSubtitle: {
        marginTop: "0.35rem",
        color: "#6b7280",
        fontSize: "0.95rem"
    },
    sortControls: {
        display: "flex",
        gap: "0.65rem",
        flexWrap: "wrap"
    },
    sortBtn: {
        padding: "0.65rem 0.9rem",
        borderRadius: "999px",
        border: "1px solid #d9deea",
        backgroundColor: "white",
        color: "#374151",
        cursor: "pointer",
        fontWeight: 700
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "1rem"
    },
    card: {
        minHeight: "165px",
        backgroundColor: "white",
        borderRadius: "18px",
        padding: "1rem",
        border: "1px solid #e5e7eb",
        cursor: "pointer",
        boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    },
    cardTop: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "0.75rem"
    },
    cardTitle: {
        fontWeight: 800,
        color: "#111827",
        fontSize: "1rem",
        lineHeight: 1.35,
        wordBreak: "break-word"
    },
    cardMenuHint: {
        color: "#9ca3af",
        fontWeight: 800,
        lineHeight: 1
    },
    previewLines: {
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        margin: "1rem 0"
    },
    previewLine: {
        height: "8px",
        borderRadius: "999px",
        backgroundColor: "#e5e7eb"
    },
    cardDate: {
        fontSize: "0.82rem",
        color: "#8b95a7",
        marginTop: "auto"
    },
    emptyText: {
        color: "#7b8496",
        fontSize: "0.95rem"
    },
    comingSoonCard: {
        maxWidth: "420px",
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "20px",
        padding: "2rem",
        boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)"
    },
    comingSoonIcon: {
        fontSize: "2.5rem",
        marginBottom: "1rem"
    },
    comingSoonTitle: {
        margin: "0 0 0.5rem",
        color: "#111827",
        fontWeight: 800
    },
    contextMenu: {
        position: "fixed",
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        boxShadow: "0 18px 40px rgba(15, 23, 42, 0.18)",
        zIndex: 1000,
        minWidth: "170px",
        padding: "0.35rem",
        overflow: "hidden"
    },
    contextItem: {
        width: "100%",
        display: "block",
        padding: "0.7rem 0.85rem",
        cursor: "pointer",
        border: "none",
        backgroundColor: "transparent",
        textAlign: "left",
        color: "#111827",
        borderRadius: "8px",
        fontSize: "0.95rem"
    },
    contextDisabled: {
        color: "#a1a1aa",
        cursor: "not-allowed"
    },
    contextDanger: {
        color: "#dc2626",
        fontWeight: 700
    },
    modalOverlay: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: "1rem"
    },
    modal: {
        width: "100%",
        maxWidth: "420px",
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "1.5rem",
        boxShadow: "0 24px 60px rgba(15, 23, 42, 0.28)",
        border: "1px solid #e5e7eb"
    },
    modalTitle: {
        margin: 0,
        color: "#111827",
        fontSize: "1.25rem",
        fontWeight: 800
    },
    modalText: {
        margin: "0.35rem 0 1rem",
        color: "#6b7280",
        fontSize: "0.95rem"
    },
    renameInput: {
        width: "100%",
        boxSizing: "border-box",
        padding: "0.85rem 1rem",
        borderRadius: "12px",
        border: "1px solid #d1d5db",
        backgroundColor: "white",
        color: "#111827",
        fontSize: "1rem",
        outline: "none"
    },
    modalActions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "0.75rem",
        marginTop: "1.25rem"
    },
    cancelBtn: {
        padding: "0.7rem 1rem",
        borderRadius: "10px",
        border: "1px solid #d1d5db",
        backgroundColor: "white",
        color: "#374151",
        cursor: "pointer",
        fontWeight: 700
    },
    saveBtn: {
        padding: "0.7rem 1rem",
        borderRadius: "10px",
        border: "none",
        backgroundColor: "#2563eb",
        color: "white",
        cursor: "pointer",
        fontWeight: 800
    },

    previewText: {
        margin: "0.8rem 0",
        color: "#6b7280",
        fontSize: "0.85rem",
        lineHeight: 1.5,
        overflow: "hidden",
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        minHeight: "3.8rem"
    }
}