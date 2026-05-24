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
    },

    resizer: {
        width: "5px",
        cursor: "col-resize",
        backgroundColor: "transparent",
        flexShrink: 0,
        userSelect: "none"
    },

    contextColorRow: {
        display: "flex",
        gap: "0.4rem",
        padding: "0.5rem 0.85rem",
        alignItems: "center"
    },
    colorDot: {
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        cursor: "pointer",
        flexShrink: 0
    }
}

export default styles