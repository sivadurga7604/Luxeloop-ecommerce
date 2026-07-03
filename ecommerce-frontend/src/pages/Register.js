import React, { useState } from "react";
import { API } from "../config";

function Register() {
    const [user, setUser] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const register = (e) => {
        if (e) e.preventDefault();
        if (!user.name || !user.email || !user.password) {
            setError("All fields are required.");
            return;
        }
        setLoading(true);
        setError("");

        fetch(`${API}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        })
            .then(res => { 
                if (!res.ok) throw new Error("Registration failed"); 
                return res.json(); 
            })
            .then(() => {
                setLoading(false);
                alert("Registration Successful!");
                window.location.href = "/login";
            })
            .catch(() => {
                setLoading(false);
                setError("Registration failed. Email might already be taken.");
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
                }}>Create Account</h1>
                <p style={{ 
                    textAlign: "center", 
                    color: "var(--text-secondary)", 
                    fontSize: "14px",
                    marginBottom: "30px" 
                }}>Join Luxeloop for an exquisite shopping experience</p>
                
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

                <form onSubmit={register}>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>Full Name</label>
                        <input 
                            placeholder="e.g., Durga Prasad" 
                            type="text"
                            value={user.name}
                            style={{ width: "100%" }}
                            onChange={e => setUser({ ...user, name: e.target.value })} 
                        />
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>Email Address</label>
                        <input 
                            placeholder="e.g., name@gmail.com" 
                            type="email"
                            value={user.email}
                            style={{ width: "100%" }}
                            onChange={e => setUser({ ...user, email: e.target.value })} 
                        />
                    </div>
                    <div style={{ marginBottom: "25px" }}>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)", marginBottom: "6px" }}>Password</label>
                        <input 
                            placeholder="Create a password" 
                            type="password"
                            value={user.password}
                            style={{ width: "100%" }}
                            onChange={e => setUser({ ...user, password: e.target.value })} 
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
                        {loading ? "Creating account..." : "Register"}
                    </button>
                </form>

                <p style={{ textAlign: "center", fontSize: "14.5px", color: "var(--text-secondary)", marginTop: "24px" }}>
                    Already have an account? <a href="/login" style={{ color: "var(--primary)", fontWeight: "600" }}>Log in instead</a>
                </p>
            </div>
        </div>
    );
}

export default Register;