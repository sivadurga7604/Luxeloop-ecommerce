import React, { useState } from "react";

const API = "https://luxeloop-backend.onrender.com";

function Register() {
    const [user, setUser] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");

    const register = () => {
        fetch(`${API}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
        })
            .then(res => { if (!res.ok) throw new Error("Registration failed"); return res.json(); })
            .then(() => { alert("Registration Successful"); window.location.href = "/login"; })
            .catch(() => setError("Registration failed. Email might already be taken."));
    };

    return (
        <div style={{ padding: "30px", maxWidth: "400px", margin: "60px auto" }}>
            <h1>Register</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input type="text" placeholder="Name"
                   style={{ display: "block", width: "100%", padding: "10px", marginBottom: "15px" }}
                   onChange={e => setUser({ ...user, name: e.target.value })} />
            <input type="email" placeholder="Email"
                   style={{ display: "block", width: "100%", padding: "10px", marginBottom: "15px" }}
                   onChange={e => setUser({ ...user, email: e.target.value })} />
            <input type="password" placeholder="Password"
                   style={{ display: "block", width: "100%", padding: "10px", marginBottom: "15px" }}
                   onChange={e => setUser({ ...user, password: e.target.value })} />
            <button onClick={register} style={{
                width: "100%", padding: "12px", background: "#c2185b",
                color: "white", border: "none", borderRadius: "8px", fontSize: "16px", cursor: "pointer"
            }}>Register</button>
        </div>
    );
}

export default Register;