import React, { useState } from "react";

const API = "https://luxeloop-backend.onrender.com";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const login = () => {
        fetch(`${API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
            .then(res => { if (!res.ok) throw new Error("Invalid credentials"); return res.json(); })
            .then(data => {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.userId);
                localStorage.setItem("name", data.name);
                localStorage.setItem("role", data.role);
                window.location.href = "/";
            })
            .catch(() => setError("Login failed. Check your email and password."));
    };

    return (
        <div style={{ padding: "30px", maxWidth: "400px", margin: "60px auto" }}>
            <h1>Login</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input placeholder="Email" type="email"
                   style={{ display: "block", width: "100%", padding: "10px", marginBottom: "15px" }}
                   onChange={e => setEmail(e.target.value)} />
            <input placeholder="Password" type="password"
                   style={{ display: "block", width: "100%", padding: "10px", marginBottom: "15px" }}
                   onChange={e => setPassword(e.target.value)} />
            <button onClick={login} style={{
                width: "100%", padding: "12px", background: "#c2185b",
                color: "white", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer"
            }}>Login</button>
        </div>
    );
}

export default Login;