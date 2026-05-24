import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { marked } from "marked"
import { useEditor } from "../hooks/useEditor.js"
import styles from "../styles/editor.styles.js"
import { jsPDF } from "jspdf"
import axios from "axios"

export default function EditorPage({ user }) {
    const { id } = useParams()
    const navigate = useNavigate()
    const [preview, setPreview] = useState(false)
    const [showExportMenu, setShowExportMenu] = useState(false)
    const [showVersionHistory, setShowVersionHistory] = useState(false)
    const [versions, setVersions] = useState([])
    const [versionFlash, setVersionFlash] = useState("")
    const [expandedVersionId, setExpandedVersionId] = useState(null)
    const [hoveredVersionId, setHoveredVersionId] = useState(null)
    const { title, setTitle, content, setContent, saved, handleManualSave, saveError, lockError, readOnly } = useEditor(id, user.id)

    const fetchVersions = useCallback(async () => {
        try {
            const res = await axios.get(`http://localhost:8082/api/versions/document/${id}`)
            setVersions(res.data)
        } catch {
            // silently ignore
        }
    }, [id])

    useEffect(() => {
        if (showVersionHistory) fetchVersions()
    }, [showVersionHistory, fetchVersions])

    const handleSaveVersion = async () => {
        const versionLabel = "v" + Date.now()
        try {
            await axios.post("http://localhost:8082/api/versions", {
                documentId: Number(id),
                title,
                content,
                versionLabel
            })
            setVersionFlash("Version saved")
            setTimeout(() => setVersionFlash(""), 2500)
            if (showVersionHistory) fetchVersions()
        } catch {
            setVersionFlash("Failed to save version")
            setTimeout(() => setVersionFlash(""), 2500)
        }
    }

    const handleRestore = (version) => {
        setTitle(version.title)
        setContent(version.content)
        setExpandedVersionId(null)
        setVersionFlash(`Restored to ${version.versionLabel}`)
        setTimeout(() => setVersionFlash(""), 2500)
    }

    const handleToggleExpand = (versionId) => {
        setExpandedVersionId(prev => prev === versionId ? null : versionId)
    }

    const formatSavedAt = (savedAt) => {
        if (!savedAt) return ""
        const d = new Date(savedAt)
        return d.toLocaleString()
    }

    const handleExportMD = (preserveMarkdown) => {
        const text = preserveMarkdown ? content : content
            .replace(/#{1,6}\s/g, "")
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .replace(/\*(.*?)\*/g, "$1")
            .replace(/`(.*?)`/g, "$1")
            .replace(/\[(.*?)\]\(.*?\)/g, "$1")
            .trim()
        const blob = new Blob([text], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${title || "document"}.md`
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleExportPDF = () => {
        const doc = new jsPDF()
        const pageWidth = doc.internal.pageSize.getWidth()
        const margin = 15
        const maxWidth = pageWidth - margin * 2

        doc.setFontSize(18)
        doc.setFont("helvetica", "bold")
        doc.text(title || "Untitled", margin, 20)

        doc.setFontSize(11)
        doc.setFont("helvetica", "normal")

        const lines = content
            .replace(/#{1,6}\s/g, "")
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .replace(/\*(.*?)\*/g, "$1")
            .replace(/`(.*?)`/g, "$1")
            .replace(/\[(.*?)\]\(.*?\)/g, "$1")
            .trim()

        const splitLines = doc.splitTextToSize(lines, maxWidth)
        doc.text(splitLines, margin, 35)
        doc.save(`${title || "document"}.pdf`)
    }

    return (
        <div style={{ ...styles.container, position: "relative" }}>
            <div style={styles.topbar}>
                <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>
                    Back
                </button>
                <input
                    style={styles.titleInput}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Untitled"
                />

                {saveError && <span style={{ color: "#dc2626", fontSize: "0.85rem" }}>{saveError}</span>}
                {lockError && <span style={{ color: "#f59e0b", fontSize: "0.85rem" }}>🔒 {lockError}</span>}
                {versionFlash && (
                    <span style={{
                        color: versionFlash.startsWith("Restored") ? "#b45309" : "#16a34a",
                        fontSize: "0.85rem",
                        fontWeight: 600
                    }}>
                        {versionFlash}
                    </span>
                )}

                <div style={styles.topRight}>
                    <div style={{ position: "relative" }}>
                        <button style={styles.previewBtn} onClick={() => setShowExportMenu(p => !p)}>
                            Export
                        </button>
                        {showExportMenu && (
                            <div style={{
                                position: "absolute",
                                top: "110%",
                                right: 0,
                                backgroundColor: "white",
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
                                zIndex: 100,
                                minWidth: "180px",
                                padding: "0.35rem",
                                display: "flex",
                                flexDirection: "column"
                            }}>
                                <button style={styles.previewBtn} onClick={() => { handleExportMD(true); setShowExportMenu(false) }}>
                                    MD (formatted)
                                </button>
                                <button style={styles.previewBtn} onClick={() => { handleExportMD(false); setShowExportMenu(false) }}>
                                    MD (plain text)
                                </button>
                                <button style={styles.previewBtn} onClick={() => { handleExportPDF(); setShowExportMenu(false) }}>
                                    PDF
                                </button>
                            </div>
                        )}
                    </div>
                    <button style={styles.previewBtn} onClick={() => setShowVersionHistory(p => !p)}>
                        Version History
                    </button>
                    <button style={styles.previewBtn} onClick={handleSaveVersion}>
                        Save Version
                    </button>
                    <button style={styles.previewBtn} onClick={() => setPreview(p => !p)}>
                        {preview ? "Edit" : "Preview"}
                    </button>
                    <button
                        style={{ ...styles.saveBtn, ...(saved ? styles.saveBtnSaved : {}) }}
                        onClick={handleManualSave}
                    >
                        {saved ? "Saved" : "Save"}
                    </button>
                </div>
            </div>

            <div style={{ ...styles.editorWrap, paddingRight: showVersionHistory ? "340px" : undefined }}>
                {preview ? (
                    <div
                        style={styles.preview}
                        className="markdown-preview"
                        dangerouslySetInnerHTML={{ __html: marked.parse(content || "") }}
                    />
                ) : (
                    <textarea
                        style={{ ...styles.editor, ...(readOnly ? { backgroundColor: "#f9f9f9", color: "#9ca3af" } : {}) }}
                        value={content}
                        onChange={(e) => !readOnly && setContent(e.target.value)}
                        placeholder="Start writing... markdown supported"
                        readOnly={readOnly}
                    />
                )}
            </div>

            {showVersionHistory && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    width: "320px",
                    height: "100vh",
                    backgroundColor: "white",
                    borderLeft: "1px solid #e5e7eb",
                    boxShadow: "-8px 0 24px rgba(15,23,42,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 200,
                    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1.25rem 1.25rem 1rem",
                        borderBottom: "1px solid #e5e7eb"
                    }}>
                        <span style={{ fontWeight: 800, fontSize: "1rem", color: "#111827", letterSpacing: "-0.01em" }}>
                            Version History
                        </span>
                        <button
                            onClick={() => setShowVersionHistory(false)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#6b7280",
                                fontSize: "1.2rem",
                                lineHeight: 1,
                                padding: "0.2rem 0.4rem",
                                borderRadius: "6px"
                            }}
                        >
                            ×
                        </button>
                    </div>
                    <div style={{ flex: 1, overflowY: "auto", padding: "0.75rem" }}>
                        {versions.length === 0 ? (
                            <p style={{ color: "#9ca3af", fontSize: "0.9rem", textAlign: "center", marginTop: "2rem" }}>
                                No versions saved yet.
                            </p>
                        ) : (
                            versions.map((v) => {
                                const isExpanded = expandedVersionId === v.id
                                const isHovered = hoveredVersionId === v.id
                                return (
                                    <div
                                        key={v.id}
                                        style={{
                                            backgroundColor: isHovered && !isExpanded ? "#f9fafb" : "white",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "12px",
                                            padding: "1rem",
                                            marginBottom: "0.75rem",
                                            cursor: "pointer",
                                            transition: "background-color 0.15s"
                                        }}
                                        onClick={() => handleToggleExpand(v.id)}
                                        onMouseEnter={() => setHoveredVersionId(v.id)}
                                        onMouseLeave={() => setHoveredVersionId(null)}
                                    >
                                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>
                                            {v.versionLabel}
                                        </div>
                                        <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.2rem" }}>
                                            {formatSavedAt(v.savedAt)}
                                        </div>

                                        {isExpanded && (
                                            <div
                                                onClick={(e) => e.stopPropagation()}
                                                style={{ marginTop: "0.85rem" }}
                                            >
                                                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151", marginBottom: "0.4rem" }}>
                                                    {v.title || "Untitled"}
                                                </div>
                                                <div style={{
                                                    maxHeight: "200px",
                                                    overflowY: "auto",
                                                    backgroundColor: "white",
                                                    border: "1px solid #e5e7eb",
                                                    borderRadius: "10px",
                                                    padding: "0.75rem",
                                                    fontSize: "0.82rem",
                                                    lineHeight: 1.6,
                                                    color: "#374151",
                                                    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
                                                    whiteSpace: "pre-wrap",
                                                    wordBreak: "break-word",
                                                    marginBottom: "0.75rem"
                                                }}>
                                                    {v.content || <span style={{ color: "#9ca3af" }}>No content</span>}
                                                </div>
                                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                                    <button
                                                        onClick={() => handleRestore(v)}
                                                        style={{
                                                            flex: 1,
                                                            padding: "0.55rem 0.9rem",
                                                            backgroundColor: "#2563eb",
                                                            color: "white",
                                                            border: "none",
                                                            borderRadius: "999px",
                                                            cursor: "pointer",
                                                            fontWeight: 700,
                                                            fontSize: "0.82rem",
                                                            boxShadow: "0 4px 12px rgba(37,99,235,0.18)"
                                                        }}
                                                    >
                                                        Restore this version
                                                    </button>
                                                    <button
                                                        onClick={() => setExpandedVersionId(null)}
                                                        style={{
                                                            padding: "0.55rem 0.9rem",
                                                            backgroundColor: "white",
                                                            color: "#374151",
                                                            border: "1px solid #d9deea",
                                                            borderRadius: "999px",
                                                            cursor: "pointer",
                                                            fontWeight: 700,
                                                            fontSize: "0.82rem"
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}