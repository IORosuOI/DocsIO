import { useNavigate } from "react-router-dom"
import { stripMarkdown } from "../utils/stripMarkdown.js"
import styles from "../styles/dashboard.styles.js"

export default function DocumentCard({ doc, onContextMenu }) {
    const navigate = useNavigate()

    return (
        <article
            style={{ ...styles.card, backgroundColor: doc.color || "white" }}
            onContextMenu={(e) => onContextMenu(e, doc)}
            onClick={() => navigate(`/editor/${doc.id}`)}
        >
            <div style={styles.cardTop}>
                <div style={styles.cardTitle}>{doc.title}</div>
                <div
                    style={styles.cardMenuHint}
                    onClick={(e) => { e.stopPropagation(); onContextMenu(e, doc) }}
                >⋯</div>
            </div>
            <div style={styles.previewText}>{stripMarkdown(doc.content)}</div>
            <div style={styles.cardDate}>
                {doc.createdAt ? doc.createdAt.slice(0, 10) : "No date"}
            </div>
        </article>
    )
}