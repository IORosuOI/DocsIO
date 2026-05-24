import { useState, useEffect, useMemo } from "react"
import axios from "axios"
import styles from "../styles/dashboard.styles.js"
import DocumentCard from "./DocumentCard.jsx"


export default function FoldersView({ user, onOpenDoc, onDocContextMenu }) {
    const [folders, setFolders] = useState([])
    const [currentFolder, setCurrentFolder] = useState(null)

    const subfolders = useMemo(() => {
        if (currentFolder === null) return folders.filter(f => !f.parentId)
        return folders.filter(f => f.parentId === currentFolder.id)
    }, [folders, currentFolder])

    const [folderDocs, setFolderDocs] = useState([])
    const [breadcrumb, setBreadcrumb] = useState([])
    const [newFolderName, setNewFolderName] = useState("")
    const [showNewFolder, setShowNewFolder] = useState(false)
    const [dragOverFolder, setDragOverFolder] = useState(null)
    const [folderCardMenu, setFolderCardMenu] = useState(null)
    const [renamingFolder, setRenamingFolder] = useState(null)
    const [renameFolderName, setRenameFolderName] = useState("")

    useEffect(() => {
        axios.get(`http://localhost:8082/api/folders/owner/${user.id}`)
            .then(res => setFolders(res.data))
    }, [])

    useEffect(() => {
        if (currentFolder === null) {
            setFolderDocs([])
        } else {
            axios.get(`http://localhost:8082/api/folders/${currentFolder.id}/children`)
                .then(res => setSubfolders(res.data))
            axios.get(`http://localhost:8082/api/folders/${currentFolder.id}/documents`)
                .then(res => setFolderDocs(res.data.filter(d => !d.deleted)))
        }
    }, [currentFolder, folders])

    const handleCreateFolder = async () => {
        if (!newFolderName.trim()) return
        const res = await axios.post("http://localhost:8082/api/folders", {
            name: newFolderName,
            parentId: currentFolder?.id || null,
            owner: { id: user.id }
        })
        setFolders(prev => [...prev, res.data])
        setNewFolderName("")
        setShowNewFolder(false)
    }

    const handleDeleteFolder = async (folderId) => {
        await axios.delete(`http://localhost:8082/api/folders/${folderId}`)
        setFolders(prev => prev.filter(f => f.id !== folderId))
        setSubfolders(prev => prev.filter(f => f.id !== folderId))
        setFolderCardMenu(null)
    }

    const handleRenameFolder = async () => {
        await axios.put(`http://localhost:8082/api/folders/${renamingFolder.id}`, {
            ...renamingFolder,
            name: renameFolderName
        })
        setFolders(prev => prev.map(f => f.id === renamingFolder.id ? { ...f, name: renameFolderName } : f))
        setRenamingFolder(null)
        setRenameFolderName("")
    }

    const handleOpenFolder = (folder) => {
        setBreadcrumb(prev => [...prev, folder])
        setCurrentFolder(folder)
    }

    const handleBreadcrumb = (index) => {
        if (index === -1) {
            setBreadcrumb([])
            setCurrentFolder(null)
        } else {
            const newCrumb = breadcrumb.slice(0, index + 1)
            setBreadcrumb(newCrumb)
            setCurrentFolder(newCrumb[newCrumb.length - 1])
        }
    }

    const handleDrop = async (e, folderId) => {
        e.preventDefault()
        const docId = e.dataTransfer.getData("docId")
        if (!docId) return
        await axios.put(`http://localhost:8082/api/documents/${docId}/move/${folderId}`)
        setFolderDocs(prev => prev.filter(d => d.id !== parseInt(docId)))
        setDragOverFolder(null)
    }

    const handleRemoveFromFolder = async (docId) => {
        await axios.put(`http://localhost:8082/api/documents/${docId}/remove-from-folder`)
        setFolderDocs(prev => prev.filter(d => d.id !== docId))
    }

    const handleFolderRightClick = (e, folder) => {
        e.preventDefault()
        e.stopPropagation()
        setFolderCardMenu({ x: e.clientX, y: e.clientY, folder })
    }

    const handleDocRightClick = (e, doc) => {
        onDocContextMenu(e, doc, handleRemoveFromFolder)
    }

    return (
        <div onClick={() => setFolderCardMenu(null)}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <span style={{ cursor: "pointer", color: "#2563eb", fontWeight: 700 }} onClick={() => handleBreadcrumb(-1)}>
                    My Folders
                </span>
                {breadcrumb.map((f, i) => (
                    <span key={f.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ color: "#9ca3af" }}>/</span>
                        <span style={{ cursor: "pointer", color: "#2563eb", fontWeight: 700 }} onClick={() => handleBreadcrumb(i)}>
                            {f.name}
                        </span>
                    </span>
                ))}
            </div>

            <div style={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                {showNewFolder ? (
                    <>
                        <input
                            style={{ ...styles.renameInput, width: "200px" }}
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                            placeholder="Folder name"
                            autoFocus
                        />
                        <button style={styles.saveBtn} onClick={handleCreateFolder}>Create</button>
                        <button style={styles.cancelBtn} onClick={() => setShowNewFolder(false)}>Cancel</button>
                    </>
                ) : (
                    <button style={styles.newBtn} onClick={() => setShowNewFolder(true)}>+ New Folder</button>
                )}
            </div>

            {subfolders.length > 0 && (
                <>
                    <p style={{ fontWeight: 700, color: "#374151", marginBottom: "0.75rem" }}>Folders</p>
                    <div style={{ ...styles.grid, marginBottom: "2rem" }}>
                        {subfolders.map(folder => (
                            <div
                                key={folder.id}
                                style={{ ...styles.card, backgroundColor: dragOverFolder === folder.id ? "#dbeafe" : "white", cursor: "pointer" }}
                                onClick={() => handleOpenFolder(folder)}
                                onContextMenu={(e) => handleFolderRightClick(e, folder)}
                                onDragOver={(e) => { e.preventDefault(); setDragOverFolder(folder.id) }}
                                onDragLeave={() => setDragOverFolder(null)}
                                onDrop={(e) => handleDrop(e, folder.id)}
                            >
                                <div style={styles.cardTop}>
                                    <div style={{ fontSize: "1.5rem" }}>📁</div>
                                    <div
                                        style={styles.cardMenuHint}
                                        onClick={(e) => { e.stopPropagation(); handleFolderRightClick(e, folder) }}
                                    >⋯</div>
                                </div>
                                <div style={styles.cardTitle}>{folder.name}</div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {currentFolder && (
                <>
                    <p style={{ fontWeight: 700, color: "#374151", marginBottom: "0.75rem" }}>Documents</p>
                    <div style={styles.grid}>
                        {folderDocs.map(doc => (
                            <DocumentCard key={doc.id} doc={doc} onContextMenu={handleDocRightClick} />
                        ))}
                        {folderDocs.length === 0 && (
                            <p style={styles.emptyText}>Drop documents here or move them from the dashboard.</p>
                        )}
                    </div>
                </>
            )}

            {subfolders.length === 0 && currentFolder === null && (
                <p style={styles.emptyText}>No folders yet. Create one!</p>
            )}

            {folderCardMenu && (
                <div
                    style={{ ...styles.contextMenu, top: folderCardMenu.y, left: folderCardMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button type="button" style={styles.contextItem} onClick={() => {
                        setRenamingFolder(folderCardMenu.folder)
                        setRenameFolderName(folderCardMenu.folder.name)
                        setFolderCardMenu(null)
                    }}>Rename</button>
                    <button type="button" style={{ ...styles.contextItem, ...styles.contextDanger }}
                            onClick={() => handleDeleteFolder(folderCardMenu.folder.id)}>
                        Delete
                    </button>
                </div>
            )}

            {renamingFolder && (
                <div style={styles.modalOverlay} onClick={() => setRenamingFolder(null)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>Rename folder</h2>
                        <input
                            style={styles.renameInput}
                            value={renameFolderName}
                            onChange={(e) => setRenameFolderName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleRenameFolder()}
                            autoFocus
                        />
                        <div style={styles.modalActions}>
                            <button style={styles.cancelBtn} onClick={() => setRenamingFolder(null)}>Cancel</button>
                            <button style={styles.saveBtn} onClick={handleRenameFolder}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}