const styles = {
    page: {
        display: "flex",
        height: "100vh",
        width: "100vw",
        fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        backgroundColor: "#f4f6fb",
        color: "#111827",
        overflow: "hidden"
    },
    leftPanel: {
        flex: 1,
        backgroundColor: "#1a1a2e",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "3rem"
    },
    brand: { marginTop: "2rem" },
    brandTitle: {
        margin: 0,
        fontSize: "3.25rem",
        fontWeight: 800,
        letterSpacing: "-0.04em"
    },
    brandTagline: {
        marginTop: "1rem",
        maxWidth: "360px",
        color: "#cbd0e5",
        fontSize: "1.05rem",
        lineHeight: 1.5
    },
    decorRow: { display: "flex", gap: "1.5rem", marginBottom: "2rem" },
    decorCard: {
        flex: 1,
        maxWidth: "180px",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.12)",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem"
    },
    decorLine: {
        height: "8px",
        borderRadius: "999px",
        backgroundColor: "rgba(255, 255, 255, 0.18)",
        width: "100%"
    },
    rightPanel: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        overflowY: "auto"
    },
    card: {
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "white",
        borderRadius: "20px",
        padding: "2.25rem",
        boxShadow: "0 24px 60px rgba(15, 23, 42, 0.10)",
        border: "1px solid #e5e7eb",
        display: "flex",
        flexDirection: "column"
    },
    cardTitle: {
        margin: 0,
        fontSize: "1.65rem",
        fontWeight: 800,
        letterSpacing: "-0.03em",
        color: "#111827"
    },
    cardSubtitle: {
        margin: "0.4rem 0 1.5rem",
        color: "#6b7280",
        fontSize: "0.95rem"
    },
    label: {
        fontSize: "0.85rem",
        fontWeight: 700,
        color: "#374151",
        marginBottom: "0.4rem",
        marginTop: "0.5rem"
    },
    input: {
        padding: "0.85rem 1rem",
        borderRadius: "12px",
        border: "1px solid #d1d5db",
        fontSize: "0.95rem",
        outline: "none",
        backgroundColor: "white",
        color: "#111827",
        marginBottom: "0.5rem",
        boxSizing: "border-box",
        width: "100%"
    },
    error: {
        margin: "0.5rem 0",
        color: "#dc2626",
        fontSize: "0.9rem",
        fontWeight: 600
    },
    button: {
        marginTop: "1rem",
        padding: "0.9rem",
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "999px",
        fontSize: "1rem",
        cursor: "pointer",
        fontWeight: 700,
        boxShadow: "0 10px 22px rgba(37, 99, 235, 0.22)"
    },
    buttonDisabled: {
        backgroundColor: "#9ca3af",
        boxShadow: "none",
        cursor: "default"
    },
    link: {
        textAlign: "center",
        marginTop: "1.25rem",
        color: "#6b7280",
        fontSize: "0.9rem"
    },
    linkAnchor: {
        color: "#2563eb",
        fontWeight: 700,
        textDecoration: "none"
    }
}

export default styles