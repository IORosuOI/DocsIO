import styles from "../styles/dashboard.styles.js"

export default function RenameModal({ renameModal, renameTitle, setRenameTitle, onClose, onSave }) {
    if (!renameModal) return null

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
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
                    <button type="button" style={styles.cancelBtn} onClick={onClose}>Cancel</button>
                    <button type="button" style={styles.saveBtn} onClick={onSave}>Save</button>
                </div>
            </div>
        </div>
    )
}