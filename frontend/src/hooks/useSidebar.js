import { useState, useEffect } from "react"

export function useSidebar() {
    const [sidebarWidth, setSidebarWidth] = useState(() => {
        const saved = localStorage.getItem("docsio_sidebar_width")
        return saved ? parseInt(saved) : 220
    })
    const [resizing, setResizing] = useState(false)

    useEffect(() => {
        if (!resizing) return
        const handleMove = (e) => {
            const newWidth = Math.max(160, Math.min(400, e.clientX))
            setSidebarWidth(newWidth)
        }
        const handleUp = () => {
            setResizing(false)
            localStorage.setItem("docsio_sidebar_width", String(sidebarWidth))
        }
        window.addEventListener("mousemove", handleMove)
        window.addEventListener("mouseup", handleUp)
        return () => {
            window.removeEventListener("mousemove", handleMove)
            window.removeEventListener("mouseup", handleUp)
        }
    }, [resizing, sidebarWidth])

    return { sidebarWidth, setResizing }
}