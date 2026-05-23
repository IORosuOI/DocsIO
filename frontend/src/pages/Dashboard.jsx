export default function Dashboard({ user, onLogout }) {
  return (
    <div>
      <p>Welcome {user.username}</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  )
}