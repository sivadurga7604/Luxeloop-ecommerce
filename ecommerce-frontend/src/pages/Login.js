import React, { useState } from "react";
import { API } from "../config";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const login = (e) => {
        if (e) e.preventDefault();
        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }
        setLoading(true);
        setError("");

        fetch(`${API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
            .then(res => { 
                if (!res.ok) throw new Error("Invalid credentials"); 
                return res.json(); 
            })
            .then(data => {
                setLoading(false);
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.userId);
                localStorage.setItem("name", data.name);
                localStorage.setItem("role", data.role);
                window.location.href = "/";
            })
            .catch(() => {
                setLoading(false);
                setError("Login failed. Check your email and password.");
            });
    };

    return (
        <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            minHeight: "70vh", 
            padding: "20px" 
        }} className="fade-in">
            <div style={{ 
                background: "#ffffff", 
                padding: "40px", 
                borderRadius: "16px", 
                boxShadow: "var(--shadow-lg)", 
                width: "100%", 
                maxWidth: "440px",
                border: "1px solid var(--border-color)"
            }}>
                <h1 style={{ 
                    textAlign: "center", 
                    marginBottom: "8px", 
                    color: "var(--primary-dark)" 
                }}>Welcome Back</h1>
                <p style={{ 
                    textAlign: "center", 
                    color: "var(--text-secondary)", 
                    fontSize: "14px",
                    marginBottom: "30px" 
                }}>Login to access your boutique cart & orders</p>
                
                {error && (
                    <div style={{ 
                        background: "#ffebee", 
                        color: "#c62828", 
                        padding: "12px", 
                        borderRadius: "8px", 
                        fontSize: "14px", 
                        marginBottom: "20px",
                        textAlign: "center",
                        fontWeight: "500",
                        border: "1px solid #ffcdd2"
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={login}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>Email Address</label>
                        <input 
                            placeholder="e.g., name@gmail.com" 
                            type="email"
                            value={email}
                            style={{ width: "100%" }}
                            onChange={e => setEmail(e.target.value)} 
                        />
                    </div>
                    <div style={{ marginBottom: "25px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>Password</label>
                        <input 
                            placeholder="Enter password" 
                            type="password"
                            value={password}
                            style={{ width: "100%" }}
                            onChange={e => setPassword(e.target.value)} 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            width: "100%", 
                            padding: "14px", 
                            background: loading ? "#aaa" : "var(--primary)",
                            color: "white", 
                            border: "none", 
                            borderRadius: "8px", 
                            fontSize: "16px", 
                            fontWeight: "600",
                            cursor: loading ? "default" : "pointer",
                            boxShadow: "0 4px 12px rgba(128,0,50,0.2)"
                        }}
                        onMouseEnter={(e) => { if(!loading) e.target.style.background = "var(--primary-light)"; }}
                        onMouseLeave={(e) => { if(!loading) e.target.style.background = "var(--primary)"; }}
                    >
                        {loading ? "Authenticating..." : "Login"}
                    </button>
                </form>

                <p style={{ textAlign: "center", fontSize: "14.5px", color: "var(--text-secondary)", marginTop: "24px" }}>
                    New to Luxeloop? <a href="/register" style={{ color: "var(--primary)", fontWeight: "600" }}>Create an account</a>
                </p>
            </div>
        </div>
    );
}

export default Login;