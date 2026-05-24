import { useState, useEffect, useRef } from "react"
import axios from "axios"

export function useEditor(id, userId) {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [saved, setSaved] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const [saveError, setSaveError] = useState("")
    const [lockError, setLockError] = useState("")
    const [readOnly, setReadOnly] = useState(false)
    const saveTimeout = useRef(null)
    const heartbeatInterval = useRef(null)
    const [docMeta, setDocMeta] = useState({})

    useEffect(() => {
        axios.get(`http://localhost:8082/api/documents/${id}`)
            .then(res => {
                setTitle(res.data.title || "")
                setContent(res.data.content || "")
                setDocMeta(res.data)
                setLoaded(true)
            })

        axios.post(`http://localhost:8082/api/locks/acquire/${id}`)
            .then(() => {
                // start heartbeat
                heartbeatInterval.current = setInterval(() => {
                    axios.post(`http://localhost:8082/api/locks/heartbeat/${id}`)
                }, 20000)
            })
            .catch(e => {
                if (e.response?.status === 423) {
                    setLockError("This document is being edited by someone else — read only")
                    setReadOnly(true)
                }
            })

        return () => {
            axios.post(`http://localhost:8082/api/locks/release/${id}`)
            if (heartbeatInterval.current) clearInterval(heartbeatInterval.current)
            if (saveTimeout.current) clearTimeout(saveTimeout.current)
        }
    }, [id])

    const doSave = async (titleVal, contentVal) => {
        if (readOnly) return
        try {
            await axios.put(`http://localhost:8082/api/documents/${id}`, {
                ...docMeta,
                title: titleVal,
                content: contentVal,
                owner: { id: userId }
            })
            setSaved(true)
            setSaveError("")
        } catch (e) {
            if (e.response?.status === 403) {
                setSaveError("Read-only — you don't have edit permission")
            }
            setSaved(false)
        }
    }

    useEffect(() => {
        if (!loaded) return
        setSaved(false)
        if (saveTimeout.current) clearTimeout(saveTimeout.current)
        saveTimeout.current = setTimeout(() => doSave(title, content), 1500)
        return () => clearTimeout(saveTimeout.current)
    }, [title, content])

    const handleManualSave = () => {
        if (saveTimeout.current) clearTimeout(saveTimeout.current)
        doSave(title, content)
    }

    return { title, setTitle, content, setContent, saved, handleManualSave, saveError, lockError, readOnly }
}