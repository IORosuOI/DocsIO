import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function SettingsPage({ user, onUserUpdate }) {
    const [activeTab, setActiveTab] = useState("account")
    const [username, setUsername] = useState(user.username)
    const [email, setEmail] = useState(user.email)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [accountMsg, setAccountMsg] = useState("")
    const [accountErr, setAccountErr] = useState("")
    const [pwdMsg, setPwdMsg] = useState("")
    const [pwdErr, setPwdErr] = useState("")
    const navigate = useNavigate()

    const tabs = [
        { id: "account", label: "Account", icon: "👤" },
        { id: "privacy", label: "Privacy", icon: "🔒" },
        { id: "notes", label: "Notes", icon: "📝" },
        { id: "notifications", label: "Notifications", icon: "🔔" },
        { id: "data", label: "Data", icon: "💾" }
    ]

    const handleSaveAccount = async () => {
        try {
            const res = await axios.put(`http://localhost:8082/api/users/${user.id}`, {
                ...user,
                username,
                email
            })
            onUserUpdate(res.data)
            setAccountMsg("Account updated")
            setAccountErr("")
        } catch (e) {
            setAccountErr("Failed to update account")
            setAccountMsg("")
        }
    }

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setPwdErr("Passwords do not match")
            return
        }
        try {
            await axios.put(`http://localhost:8082/api/users/${user.id}/password`, {
                currentPassword,
                newPassword
            })
            setPwdMsg("Password changed")
            setPwdErr("")
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
        } catch (e) {
            setPwdErr("Failed to change password (check current password)")
            setPwdMsg("")
        }
    }

    return (
        <div style={styles.container}>
            <aside style={styles.sidebar}>
                <button style={styles.backBtn} onClick={() => navigate("/dashboard")}>← Back</button>
                <h2 style={styles.logo}>Settings</h2>
                <nav style={styles.nav}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            style={{ ...styles.tab, ...(activeTab === tab.id ? styles.tabActive : {}) }}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span style={styles.tabIcon}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </aside>

            <main style={styles.main}>
                {activeTab === "account" && (
                    <div style={styles.section}>
                        <h1 style={styles.sectionTitle}>Account</h1>
                        <p style={styles.sectionSubtitle}>Update your personal information.</p>

                        <label style={styles.label}>Username</label>
                        <input style={styles.input} value={username} onChange={(e) => setUsername(e.target.value)} />

                        <label style={styles.label}>Email</label>
                        <input style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />

                        {accountMsg && <p style={styles.success}>{accountMsg}</p>}
                        {accountErr && <p style={styles.error}>{accountErr}</p>}
                        <button style={styles.saveBtn} onClick={handleSaveAccount}>Save changes</button>

                        <div style={styles.divider} />

                        <h2 style={styles.subTitle}>Change password</h2>
                        <label style={styles.label}>Current password</label>
                        <input type="password" style={styles.input} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        <label style={styles.label}>New password</label>
                        <input type="password" style={styles.input} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        <label style={styles.label}>Confirm new password</label>
                        <input type="password" style={styles.input} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                        {pwdMsg && <p style={styles.success}>{pwdMsg}</p>}
                        {pwdErr && <p style={styles.error}>{pwdErr}</p>}
                        <button style={styles.saveBtn} onClick={handleChangePassword}>Change password</button>
                    </div>
                )}

                {activeTab !== "account" && (
                    <div style={styles.section}>
                        <h1 style={styles.sectionTitle}>{tabs.find(t => t.id === activeTab)?.label}</h1>
                        <p style={styles.sectionSubtitle}>This section is coming soon.</p>
                    </div>
                )}
            </main>
        </div>
    )
}

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