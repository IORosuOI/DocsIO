import { useState, useEffect } from "react"
import axios from "axios"

export function useDocuments(userId) {
    const [documents, setDocuments] = useState([])
    const [sharedDocuments, setSharedDocuments] = useState([])

    const fetchDocuments = async () => {
        const res = await axios.get(`http://localhost:8082/api/documents/owner/${userId}`)
        setDocuments(res.data)
    }

    const fetchSharedDocuments = async () => {
        const res = await axios.get(`http://localhost:8082/api/permissions/user/${userId}`)
        setSharedDocuments(res.data.map(p => ({ ...p.document, accessLevel: p.accessLevel, permissionId: p.id })))
    }

    useEffect(() => { fetchDocuments(); fetchSharedDocuments() }, [])

    const createDocument = async () => {
        await axios.post("http://localhost:8082/api/documents", {
            title: "Untitled", content: "", owner: { id: userId }
        })
        fetchDocuments()
    }

    const updateDocument = async (id, payload) => {
        await axios.put(`http://localhost:8082/api/documents/${id}`, payload)
    }

    const deleteDocument = async (id) => {
        await axios.delete(`http://localhost:8082/api/documents/${id}`)
    }

    return { documents, setDocuments, fetchDocuments, createDocument, updateDocument, deleteDocument, sharedDocuments }
}