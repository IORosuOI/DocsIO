export function stripMarkdown(text) {
    if (!text) return "Empty document"
    return text
        .replace(/[#>*_`~\-]/g, "")
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/\s+/g, " ")
        .trim()
}