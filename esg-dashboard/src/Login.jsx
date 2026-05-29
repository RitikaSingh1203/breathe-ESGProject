import { useState, useEffect } from "react"
import axios from "axios"   // ✅ FIX 1: ADDED MISSING IMPORT
import { useNavigate } from "react-router-dom"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const savedUser = localStorage.getItem("username")
    if (savedUser) {
      setUsername(savedUser)
      setRememberMe(true)
    }
  }, [])

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password
      })

      // ✅ FIX 2: status "success" ❌ -> "ok" ✅
      if (res.data.status === "ok") {
        localStorage.setItem("loggedIn", "true")
        navigate("/dashboard")
      } else {
        alert("Invalid credentials")
      }

    } catch (err) {
      console.log(err)
      alert("Server error")
    }
  }

  const inputWrapper = {
    position: "relative",
    width: "100%",
    marginBottom: "14px"
  }

  const inputStyle = {
    width: "100%",
    height: "42px",
    padding: "0 40px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.15)",
    outline: "none",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    fontSize: "14px",
    boxSizing: "border-box"
  }

  const iconStyle = {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "15px",
    opacity: 0.8
  }

  const eyeStyle = {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "15px",
    opacity: 0.8
  }

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage:
        "linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('/bg.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      fontFamily: "Arial"
    }}>
      
      <div style={{
        width: "360px",
        padding: "30px",
        borderRadius: "18px",
        background: "rgba(20, 30, 20, 0.55)",
        border: "1px solid rgba(255,255,255,0.15)",
        backdropFilter: "blur(18px)",
        textAlign: "center",
        color: "white",
        boxShadow: "0 12px 35px rgba(0,0,0,0.5)"
      }}>
        
        <div style={{ fontSize: "30px", marginBottom: "5px" }}>🌍</div>

        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "600" }}>
          <span style={{ color: "#00e676" }}>ESG</span> Portal
        </h1>

        <p style={{ fontSize: "12px", opacity: 0.75, marginBottom: "20px" }}>
          Sustainability Dashboard
        </p>

        {/* Username */}
        <div style={inputWrapper}>
          <span style={iconStyle}>👤</span>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Password */}
        <div style={inputWrapper}>
          <span style={iconStyle}>🔒</span>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <span onClick={() => setShowPassword(!showPassword)} style={eyeStyle}>
            {showPassword ? "👁️" : "🙈"}
          </span>
        </div>

        {/* Remember */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "12px",
          marginBottom: "18px",
          color: "#a6f4a6"
        }}>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />{" "}
            Remember me
          </label>

          <span onClick={() => alert("Reset coming soon")} style={{ cursor: "pointer" }}>
            Forgot Password?
          </span>
        </div>

        {/* Button */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(to right,#00c853,#64dd17)",
            color: "white",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer"
          }}
        >
          Login →
        </button>
      </div>
    </div>
  )
}

export default Login