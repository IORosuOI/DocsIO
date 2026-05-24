import { useState, useEffect, useRef } from "react"
import axios from "axios"

export function useEditor(id, userId) {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [saved, setSaved] = useState(true)
    const [loaded, setLoaded] = useState(false)
    const saveTimeout = useRef(null)

    useEffect(() => {
        axios.get(`http://localhost:8082/api/documents/${id}`)
            .then(res => {
                setTitle(res.data.title || "")
                setContent(res.data.content || "")
                setLoaded(true)
            })
    }, [id])

    const doSave = async (titleVal, contentVal) => {
        await axios.put(`http://localhost:8082/api/documents/${id}`, {
            title: titleVal,
            content: contentVal,
            owner: { id: userId }
        })
        setSaved(true)
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

    return { title, setTitle, content, setContent, saved, handleManualSave }
}