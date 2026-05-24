import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { marked } from "marked"
import { useEditor } from "../hooks/useEditor.js"
import styles from "../styles/editor.styles.js"
import { jsPDF } from "jspdf"

export default function EditorPage({ user }) {
    const { id } = useParams()
    const navigate = useNavigate()
    const [preview, setPreview] = useState(false)
    const [showExportMenu, setShowExportMenu] = useState(false)
    const { title, setTitle, content, setContent, saved, handleManualSave, saveError, lockError, readOnly } = useEditor(id, user.id)

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
        <div style={styles.container}>
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

            <div style={styles.editorWrap}>
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
        </div>
    )
}