const styles = {
    container: { display: "flex", height: "100vh", width: "100vw", fontFamily: "Inter, system-ui, sans-serif", backgroundColor: "#f4f6fb", color: "#111827", overflow: "hidden" },
    sidebar: { width: "240px", backgroundColor: "#1a1a2e", color: "white", display: "flex", flexDirection: "column", padding: "1.25rem", boxSizing: "border-box" },
    backBtn: { padding: "0.5rem 0.85rem", border: "1px solid rgba(255,255,255,0.18)", borderRadius: "999px", background: "transparent", color: "white", cursor: "pointer", marginBottom: "1rem", textAlign: "left", fontWeight: 600 },
    logo: { margin: "0 0 1.5rem", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.04em" },
    nav: { display: "flex", flexDirection: "column", gap: "0.35rem" },
    tab: { display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.75rem 0.85rem", borderRadius: "10px", cursor: "pointer", border: "none", backgroundColor: "transparent", color: "#d6d8e8", fontSize: "0.95rem", textAlign: "left" },
    tabActive: { backgroundColor: "rgba(255,255,255,0.12)", color: "white", fontWeight: 700 },
    tabIcon: { width: "1.35rem", display: "inline-flex", justifyContent: "center" },
    main: { flex: 1, padding: "2.5rem 3rem", overflowY: "auto" },
    section: { maxWidth: "560px" },
    sectionTitle: { margin: 0, fontSize: "1.85rem", fontWeight: 800, letterSpacing: "-0.03em" },
    sectionSubtitle: { margin: "0.4rem 0 2rem", color: "#6b7280" },
    subTitle: { fontSize: "1.2rem", fontWeight: 800, margin: "0 0 0.5rem" },
    label: { display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#374151", marginTop: "1rem", marginBottom: "0.4rem" },
    input: { width: "100%", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid #d1d5db", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" },
    saveBtn: { marginTop: "1.25rem", padding: "0.8rem 1.4rem", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "999px", cursor: "pointer", fontWeight: 700, boxShadow: "0 10px 22px rgba(37,99,235,0.22)" },
    divider: { height: "1px", backgroundColor: "#e5e7eb", margin: "2.5rem 0 1.5rem" },
    success: { color: "#059669", fontWeight: 600, margin: "0.75rem 0" },
    error: { color: "#dc2626", fontWeight: 600, margin: "0.75rem 0" }
}

export default styles