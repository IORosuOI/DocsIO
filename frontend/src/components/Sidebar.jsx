import { useNavigate } from "react-router-dom"
import styles from "../styles/dashboard.styles.js"

const sections = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "folders", label: "Folders", icon: "📁" },
    { id: "notes", label: "My Notes", icon: "📝" },
    { id: "shared", label: "Shared", icon: "👥" },
    { id: "trash", label: "Trash", icon: "🗑️" },
]

export default function Sidebar({ user, activeSection, setActiveSection, sidebarWidth, setResizing, onLogout }) {
    const navigate = useNavigate()

    const getAvatarInitial = () =>
        user?.username?.trim()?.charAt(0)?.toUpperCase() || "U"

    return (
        <>
            <aside style={{ ...styles.sidebar, width: sidebarWidth }}>
                <h2 style={styles.logo}>docsIO</h2>
                <nav style={styles.sidebarNav}>
                    {sections.map(section => (
                        <button
                            key={section.id}
                            type="button"
                            style={{ ...styles.sidebarItem, ...(activeSection === section.id ? styles.sidebarActive : {}) }}
                            onClick={() => setActiveSection(section.id)}
                        >
                            <span style={styles.sidebarIcon}>{section.icon}</span>
                            {section.label}
                        </button>
                    ))}
                </nav>
                <div style={styles.sidebarBottom}>
                    <button type="button" style={styles.sidebarItem} onClick={() => navigate("/analytics")}>
                        <span style={styles.sidebarIcon}>📊</span>
                        Analytics
                    </button>
                    <button type="button" style={styles.sidebarItem} onClick={() => navigate("/settings")}>
                        <span style={styles.sidebarIcon}>⚙️</span>
                        Settings
                    </button>
                    <div style={styles.userBlock}>
                        <div style={styles.avatar}>{getAvatarInitial()}</div>
                        <div style={styles.username}>{user?.username}</div>
                    </div>
                    <button type="button" style={styles.logoutBtn} onClick={onLogout}>Logout</button>
                </div>
            </aside>
            <div style={styles.resizer} onMouseDown={() => setResizing(true)} />
        </>
    )
}