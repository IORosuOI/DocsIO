import { useState } from "react"
import axios from "axios"

export function useSettings(user, onUserUpdate) {
    const [username, setUsername] = useState(user.username)
    const [email, setEmail] = useState(user.email)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [accountMsg, setAccountMsg] = useState("")
    const [accountErr, setAccountErr] = useState("")
    const [pwdMsg, setPwdMsg] = useState("")
    const [pwdErr, setPwdErr] = useState("")

    const handleSaveAccount = async () => {
        try {
            const res = await axios.put(`http://localhost:8082/api/users/${user.id}`, { ...user, username, email })
            onUserUpdate(res.data)
            setAccountMsg("Account updated")
            setAccountErr("")
        } catch {
            setAccountErr("Failed to update account")
            setAccountMsg("")
        }
    }

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) { setPwdErr("Passwords do not match"); return }
        try {
            await axios.put(`http://localhost:8082/api/users/${user.id}/password`, { currentPassword, newPassword })
            setPwdMsg("Password changed")
            setPwdErr("")
            setCurrentPassword(""); setNewPassword(""); setConfirmPassword("")
        } catch {
            setPwdErr("Failed to change password (check current password)")
            setPwdMsg("")
        }
    }

    return {
        username, setUsername, email, setEmail,
        currentPassword, setCurrentPassword,
        newPassword, setNewPassword,
        confirmPassword, setConfirmPassword,
        accountMsg, accountErr, pwdMsg, pwdErr,
        handleSaveAccount, handleChangePassword
    }
}