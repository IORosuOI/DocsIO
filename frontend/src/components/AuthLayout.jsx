import styles from "../styles/auth.styles.js"

export default function AuthLayout({ tagline, children }) {
    return (
        <div style={styles.page}>
            <div style={styles.leftPanel}>
                <div style={styles.brand}>
                    <h1 style={styles.brandTitle}>docsIO</h1>
                    <p style={styles.brandTagline}>{tagline}</p>
                </div>
                <div style={styles.decorRow}>
                    <div style={{ ...styles.decorCard, transform: "rotate(-3deg)" }}>
                        <div style={styles.decorLine} />
                        <div style={{ ...styles.decorLine, width: "70%" }} />
                        <div style={{ ...styles.decorLine, width: "55%" }} />
                    </div>
                    <div style={{ ...styles.decorCard, transform: "rotate(2deg)" }}>
                        <div style={styles.decorLine} />
                        <div style={{ ...styles.decorLine, width: "60%" }} />
                        <div style={{ ...styles.decorLine, width: "80%" }} />
                    </div>
                </div>
            </div>
            <div style={styles.rightPanel}>
                {children}
            </div>
        </div>
    )
}