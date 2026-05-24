const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        backgroundColor: "#f4f6fb",
        color: "#111827",
        overflow: "hidden",
        boxSizing: "border-box"
    },
    topbar: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem 2rem",
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "white",
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.04)"
    },
    backBtn: {
        padding: "0.65rem 1rem",
        border: "1px solid #d9deea",
        borderRadius: "999px",
        cursor: "pointer",
        backgroundColor: "white",
        color: "#374151",
        fontWeight: 700,
        fontSize: "0.9rem"
    },
    titleInput: {
        flex: 1,
        fontSize: "1.35rem",
        fontWeight: 800,
        letterSpacing: "-0.02em",
        border: "none",
        outline: "none",
        padding: "0.5rem 0.75rem",
        color: "#111827",
        backgroundColor: "transparent"
    },
    topRight: {
        display: "flex",
        alignItems: "center",
        gap: "0.6rem"
    },
    previewBtn: {
        padding: "0.65rem 1rem",
        borderRadius: "999px",
        border: "1px solid #d9deea",
        backgroundColor: "white",
        color: "#374151",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: "0.9rem"
    },
    saveBtn: {
        padding: "0.65rem 1.2rem",
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "999px",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: "0.9rem",
        boxShadow: "0 10px 22px rgba(37, 99, 235, 0.22)"
    },
    saveBtnSaved: {
        backgroundColor: "#9ca3af",
        boxShadow: "none",
        cursor: "default"
    },
    editorWrap: {
        flex: 1,
        display: "flex",
        padding: "1.5rem 2rem 2rem",
        overflow: "hidden",
        boxSizing: "border-box"
    },
    editor: {
        flex: 1,
        padding: "1.5rem",
        fontSize: "1rem",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        outline: "none",
        resize: "none",
        lineHeight: 1.65,
        fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        backgroundColor: "white",
        color: "#111827",
        boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)"
    },
    preview: {
        flex: 1,
        padding: "1.5rem 2rem",
        backgroundColor: "white",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        overflowY: "auto",
        lineHeight: 1.7,
        color: "#111827",
        boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)"
    }
}

export default styles