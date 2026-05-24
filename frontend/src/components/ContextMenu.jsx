import styles from "../styles/dashboard.styles.js"

const COLORS = ["#ffffff", "#fef9c3", "#dcfce7", "#dbeafe", "#fce7f3", "#f3e8ff"]

export default function ContextMenu({ contextMenu, activeSection, onRename, onColorChange, onRestore, onDelete, onShare }) {
    if (!contextMenu) return null

    const isShared = !!contextMenu.doc.permissionId

    return (
        <div
            style={{ ...styles.contextMenu, top: contextMenu.y, left: contextMenu.x }}
            onClick={(e) => e.stopPropagation()}
        >
            {!isShared && (
                <button type="button" style={styles.contextItem} onClick={onRename}>Rename</button>
            )}

            {!isShared && (
                <div style={styles.contextColorRow}>
                    {COLORS.map(c => (
                        <div
                            key={c}
                            style={{
                                ...styles.colorDot,
                                backgroundColor: c,
                                border: contextMenu.doc.color === c ? "2px solid #2563eb" : "2px solid #e5e7eb"
                            }}
                            onClick={() => onColorChange(c)}
                        />
                    ))}
                </div>
            )}

            {activeSection === "trash" && (
                <button type="button" style={styles.contextItem} onClick={() => onRestore(contextMenu.doc.id)}>
                    Restore
                </button>
            )}

            {!isShared && (
                <button type="button" style={styles.contextItem} onClick={onShare}>Share</button>
            )}

            {!isShared && (
                <button type="button" style={{ ...styles.contextItem, ...styles.contextDanger }} onClick={() => onDelete(contextMenu.doc.id)}>
                    Delete
                </button>
            )}
        </div>
    )
}