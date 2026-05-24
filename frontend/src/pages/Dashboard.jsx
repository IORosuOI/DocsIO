import { useState, useMemo } from "react"
import axios from "axios"
import styles from "../styles/dashboard.styles.js"
import { useDocuments } from "../hooks/useDocuments.js"
import { useSidebar } from "../hooks/useSidebar.js"
import Sidebar from "../components/Sidebar.jsx"
import DocumentCard from "../components/DocumentCard.jsx"
import ContextMenu from "../components/ContextMenu.jsx"
import RenameModal from "../components/RenameModal.jsx"
import ShareModal from "../components/ShareModal.jsx"

export default function Dashboard({ user, onLogout }) {
    const [activeSection, setActiveSection] = useState("home")
    const [contextMenu, setContextMenu] = useState(null)
    const [renameModal, setRenameModal] = useState(null)
    const [renameTitle, setRenameTitle] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [shareModal, setShareModal] = useState(null)

    const { documents, setDocuments, fetchDocuments, createDocument, updateDocument, deleteDocument, sharedDocuments } = useDocuments(user.id)
    const { sidebarWidth, setResizing } = useSidebar()

    const visibleDocuments = useMemo(() => {
        let docs = []
        if (activeSection === "home" || activeSection === "notes") docs = documents.filter(d => !d.deleted)
        else if (activeSection === "trash") docs = documents.filter(d => d.deleted === true)
        else if (activeSection === "shared") docs = sharedDocuments
        else docs = []
        if (!searchTerm.trim()) return docs
        return docs.filter(d => (d.title || "").toLowerCase().includes(searchTerm.toLowerCase()))
    }, [activeSection, documents, sharedDocuments, searchTerm])

    const sectionTitle = useMemo(() => ({
        home: "Recent Documents", notes: "My Notes", folders: "Folders",
        shared: "Shared Documents", trash: "Trash"
    }[activeSection] || "Documents"), [activeSection])

    const handleRightClick = (e, doc) => {
        e.preventDefault(); e.stopPropagation()
        setContextMenu({ x: e.clientX, y: e.clientY, doc })
    }

    const handleDelete = async (id) => {
        if (contextMenu.doc.deleted) {
            await deleteDocument(id)
            setDocuments(prev => prev.filter(d => d.id !== id))
        } else {
            await updateDocument(id, { ...contextMenu.doc, deleted: true, owner: { id: user.id } })
            setDocuments(prev => prev.map(d => d.id === id ? { ...d, deleted: true } : d))
        }
        setContextMenu(null)
    }

    const handleRestore = async (id) => {
        await updateDocument(id, { ...contextMenu.doc, deleted: false, owner: { id: user.id } })
        setDocuments(prev => prev.map(d => d.id === id ? { ...d, deleted: false } : d))
        setContextMenu(null)
    }

    const handleColorChange = async (color) => {
        await updateDocument(contextMenu.doc.id, { ...contextMenu.doc, color, owner: { id: user.id } })
        setDocuments(prev => prev.map(d => d.id === contextMenu.doc.id ? { ...d, color } : d))
        setContextMenu(null)
    }

    const openRenameModal = () => {
        setRenameModal(contextMenu.doc)
        setRenameTitle(contextMenu.doc.title || "")
        setContextMenu(null)
    }

    const handleRenameSave = async () => {
        if (!renameModal) return
        await updateDocument(renameModal.id, { ...renameModal, title: renameTitle, owner: renameModal.owner || { id: user.id } })
        setDocuments(prev => prev.map(d => d.id === renameModal.id ? { ...d, title: renameTitle } : d))
        setRenameModal(null)
        setRenameTitle("")
    }

    const handleSortByTitle = () =>
        setDocuments(prev => [...prev].sort((a, b) => (a.title || "").localeCompare(b.title || "")))

    const handleSortByDate = () =>
        setDocuments(prev => [...prev].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)))

    const getEmptyMessage = () => ({
        folders: "Folders are coming soon.",
        shared: "No shared documents yet.",
        trash: "Trash is empty."
    }[activeSection] || "No documents yet. Create one!")

    const openShareModal = () => {
        setShareModal(contextMenu.doc)
        setContextMenu(null)
    }

    return (
        <div style={styles.container} onClick={() => setContextMenu(null)}>
            <Sidebar
                user={user}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                sidebarWidth={sidebarWidth}
                setResizing={setResizing}
                onLogout={onLogout}
            />

            <main style={styles.main}>
                <div style={styles.topbar}>
                    <div style={styles.topbarSpacer} />
                    <input style={styles.search} placeholder="Search documents..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <button style={styles.newBtn} onClick={createDocument}>+ New Document</button>
                </div>

                <div style={styles.headerRow}>
                    <div>
                        <h1 style={styles.sectionTitle}>{sectionTitle}</h1>
                        <p style={styles.sectionSubtitle}>Organize and open your docs from one clean workspace.</p>
                    </div>
                    <div style={styles.sortControls}>
                        <button type="button" style={styles.sortBtn} onClick={handleSortByTitle}>Sort by Title</button>
                        <button type="button" style={styles.sortBtn} onClick={handleSortByDate}>Sort by Date</button>
                    </div>
                </div>

                {activeSection === "folders" ? (
                    <div style={styles.comingSoonCard}>
                        <div style={styles.comingSoonIcon}>📁</div>
                        <h2 style={styles.comingSoonTitle}>Coming soon</h2>
                        <p style={styles.emptyText}>Folder organization will be available here.</p>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {visibleDocuments.map(doc => (
                            <DocumentCard key={doc.id} doc={doc} onContextMenu={handleRightClick} />
                        ))}
                        {visibleDocuments.length === 0 && <p style={styles.emptyText}>{getEmptyMessage()}</p>}
                    </div>
                )}
            </main>

            <ContextMenu
                contextMenu={contextMenu}
                activeSection={activeSection}
                onRename={openRenameModal}
                onColorChange={handleColorChange}
                onRestore={handleRestore}
                onDelete={handleDelete}
                onShare={openShareModal}
            />

            <RenameModal
                renameModal={renameModal}
                renameTitle={renameTitle}
                setRenameTitle={setRenameTitle}
                onClose={() => { setRenameModal(null); setRenameTitle("") }}
                onSave={handleRenameSave}
            />


            {shareModal && (
                <ShareModal
                    doc={shareModal}
                    currentUser={user}
                    onClose={() => setShareModal(null)}
                />
            )}

        </div>
    )
}