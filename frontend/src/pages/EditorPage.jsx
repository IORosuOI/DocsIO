import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { marked } from "marked"
import { useEditor } from "../hooks/useEditor.js"
import styles from "../styles/editor.styles.js"

export default function EditorPage({ user }) {
    const { id } = useParams()
    const navigate = useNavigate()
    const [preview, setPreview] = useState(false)
    const { title, setTitle, content, setContent, saved, handleManualSave } = useEditor(id, user.id)

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
                <div style={styles.topRight}>
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
                        dangerouslySetInnerHTML={{ __html: marked.parse(content || "") }}
                    />
                ) : (
                    <textarea
                        style={styles.editor}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Start writing... markdown supported (# headers, **bold**, *italic*, lists)"
                    />
                )}
            </div>
        </div>
    )
}