import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSettings } from "../hooks/useSettings.js"
import styles from "../styles/settings.styles.js"

const tabs = [
    { id: "account", label: "Account", icon: "👤" },
    { id: "privacy", label: "Privacy", icon: "🔒" },
    { id: "notes", label: "Notes", icon: "📝" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "data", label: "Data", icon: "💾" }
]

export default function SettingsPage({ user, onUserUpdate }) {
    const [activeTab, setActiveTab] = useState("account")
    const navigate = useNavigate()
    const {
        username, setUsername, email, setEmail,
        currentPassword, setCurrentPassword,
        newPassword, setNewPassword,
        confirmPassword, setConfirmPassword,
        accountMsg, accountErr, pwdMsg, pwdErr,
        handleSaveAccount, handleChangePassword
    } = useSettings(user, onUserUpdate)

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
                {activeTab === "account" ? (
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
                ) : (
                    <div style={styles.section}>
                        <h1 style={styles.sectionTitle}>{tabs.find(t => t.id === activeTab)?.label}</h1>
                        <p style={styles.sectionSubtitle}>This section is coming soon.</p>
                    </div>
                )}
            </main>
        </div>
    )
}