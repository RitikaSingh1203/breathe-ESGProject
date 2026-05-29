import { Navigate } from "react-router-dom"

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("loggedIn")

  return isLoggedIn ? children : <Navigate to="/" />
}

export default ProtectedRoute