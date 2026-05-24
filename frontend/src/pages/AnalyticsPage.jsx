import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const font = "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"

const sidebarBtnBase = {
    display: "flex",
    alignItems: "center",
    gap: "0.65rem",
    padding: "0.75rem 0.85rem",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "transparent",
    color: "#d6d8e8",
    fontSize: "0.95rem",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
    fontFamily: font
}

export default function AnalyticsPage({ user }) {
    const navigate = useNavigate()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        axios.get(`http://localhost:8082/api/analytics/user/${user.id}`)
            .then(res => { setData(res.data); setLoading(false) })
            .catch(() => { setError("Failed to load analytics."); setLoading(false) })
    }, [user.id])

    const formatDate = (dt) => {
        if (!dt) return ""
        return new Date(dt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    }

    const barWidthPct = (index, list) => {
        if (!list || list.length === 0) return "100%"
        const timestamps = list.map(d => new Date(d.lastModified).getTime())
        const max = Math.max(...timestamps)
        const min = Math.min(...timestamps)
        if (max === min) return "100%"
        const pct = ((timestamps[index] - min) / (max - min)) * 82 + 18
        return `${pct.toFixed(1)}%`
    }

    const statCards = data ? [
        { label: "Total Documents", value: data.totalDocuments, icon: "📄", accent: "#2563eb" },
        { label: "Total Versions",  value: data.totalVersions,  icon: "🕓", accent: "#7c3aed" },
        { label: "In Folders",      value: data.documentsInFolders, icon: "📁", accent: "#0891b2" },
        { label: "Shared",          value: data.sharedDocuments, icon: "👥", accent: "#059669" },
    ] : []

    return (
        <div style={{ display: "flex", height: "100vh", width: "100vw", fontFamily: font, backgroundColor: "#f4f6fb", color: "#111827", overflow: "hidden" }}>

            {/* Sidebar */}
            <aside style={{ width: "220px", backgroundColor: "#1a1a2e", color: "white", display: "flex", flexDirection: "column", padding: "1.25rem", boxSizing: "border-box", flexShrink: 0 }}>
                <h2 style={{ margin: "0 0 1.75rem", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.04em", color: "white", fontFamily: font }}>
                    docsIO
                </h2>

                <nav style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    <button style={sidebarBtnBase} onClick={() => navigate("/dashboard")}>
                        <span>🏠</span> Dashboard
                    </button>
                    <button style={{ ...sidebarBtnBase, backgroundColor: "rgba(255,255,255,0.12)", color: "white", fontWeight: 700 }}>
                        <span>📊</span> Analytics
                    </button>
                </nav>

                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <button style={sidebarBtnBase} onClick={() => navigate("/settings")}>
                        <span>⚙️</span> Settings
                    </button>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", padding: "0.8rem", borderRadius: "14px", backgroundColor: "rgba(255,255,255,0.08)" }}>
                        <div style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "white", color: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.9rem", flexShrink: 0 }}>
                            {user?.username?.trim()?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <span style={{ color: "#f7f7fb", fontSize: "0.9rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {user?.username}
                        </span>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main style={{ flex: 1, overflowY: "auto", padding: "2rem 2.5rem", boxSizing: "border-box" }}>
                <div style={{ marginBottom: "2rem" }}>
                    <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#111827" }}>
                        Analytics
                    </h1>
                    <p style={{ margin: "0.35rem 0 0", color: "#6b7280", fontSize: "0.95rem" }}>
                        An overview of your writing activity.
                    </p>
                </div>

                {loading && (
                    <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>Loading...</p>
                )}
                {error && (
                    <p style={{ color: "#dc2626", fontSize: "0.95rem" }}>{error}</p>
                )}

                {data && (
                    <>
                        {/* Stat cards */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.75rem" }}>
                            {statCards.map(card => (
                                <div key={card.label} style={{
                                    backgroundColor: "white",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "18px",
                                    padding: "1.35rem 1.5rem",
                                    boxShadow: "0 12px 28px rgba(15,23,42,0.06)"
                                }}>
                                    <div style={{ fontSize: "1.45rem", marginBottom: "0.6rem" }}>{card.icon}</div>
                                    <div style={{ fontSize: "2.1rem", fontWeight: 800, color: card.accent, letterSpacing: "-0.04em", lineHeight: 1 }}>
                                        {card.value}
                                    </div>
                                    <div style={{ fontSize: "0.83rem", color: "#6b7280", marginTop: "0.35rem", fontWeight: 600 }}>
                                        {card.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bar chart — Most Edited Documents */}
                        <div style={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "18px",
                            padding: "1.5rem 1.75rem",
                            boxShadow: "0 12px 28px rgba(15,23,42,0.06)",
                            marginBottom: "1.5rem"
                        }}>
                            <h2 style={{ margin: "0 0 1.35rem", fontSize: "1.05rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
                                Most Edited Documents
                            </h2>
                            {data.mostEditedDocs.length === 0 ? (
                                <p style={{ color: "#9ca3af", fontSize: "0.9rem", margin: 0 }}>No documents yet.</p>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                                    {data.mostEditedDocs.map((doc, i) => (
                                        <div
                                            key={doc.id}
                                            onClick={() => navigate(`/editor/${doc.id}`)}
                                            style={{ display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}
                                        >
                                            <div style={{ width: "160px", flexShrink: 0, fontSize: "0.87rem", fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {doc.title || "Untitled"}
                                            </div>
                                            <div style={{ flex: 1, height: "26px", backgroundColor: "#f4f6fb", borderRadius: "8px", overflow: "hidden" }}>
                                                <div style={{
                                                    width: barWidthPct(i, data.mostEditedDocs),
                                                    height: "100%",
                                                    background: `linear-gradient(90deg, #2563eb, #3b82f6)`,
                                                    borderRadius: "8px",
                                                    opacity: 1 - i * 0.1,
                                                    transition: "width 0.5s ease"
                                                }} />
                                            </div>
                                            <div style={{ width: "95px", flexShrink: 0, fontSize: "0.78rem", color: "#9ca3af", textAlign: "right" }}>
                                                {formatDate(doc.lastModified)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div style={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "18px",
                            padding: "1.5rem 1.75rem",
                            boxShadow: "0 12px 28px rgba(15,23,42,0.06)"
                        }}>
                            <h2 style={{ margin: "0 0 0.75rem", fontSize: "1.05rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
                                Recent Activity
                            </h2>
                            {data.recentActivity.length === 0 ? (
                                <p style={{ color: "#9ca3af", fontSize: "0.9rem", margin: 0 }}>No recent activity.</p>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    {data.recentActivity.map((doc, i) => (
                                        <div
                                            key={doc.id}
                                            onClick={() => navigate(`/editor/${doc.id}`)}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                padding: "0.8rem 0.65rem",
                                                borderBottom: i < data.recentActivity.length - 1 ? "1px solid #f3f4f6" : "none",
                                                cursor: "pointer",
                                                borderRadius: "10px",
                                                transition: "background-color 0.15s"
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#f9fafb" }}
                                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent" }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                <span style={{ fontSize: "1rem", flexShrink: 0 }}>📄</span>
                                                <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "#111827" }}>
                                                    {doc.title || "Untitled"}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: "0.79rem", color: "#9ca3af", flexShrink: 0, marginLeft: "1rem" }}>
                                                {formatDate(doc.lastModified)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}
