import React, { useEffect, useState } from "react";
import { API } from "../config";

function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        fetch(`${API}/products`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch products: " + res.status);
                return res.json();
            })
            .then(data => setProducts(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error("Dashboard products fetch error:", err);
                setProducts([]);
            });

        fetch(`${API}/order`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch orders: " + res.status);
                return res.json();
            })
            .then(data => {
                setOrders(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Dashboard orders fetch error:", err);
                setOrders([]);
                setLoading(false);
            });
    }, []);

    const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    return (
        <div style={{ padding: "40px 5%", maxWidth: "1200px", margin: "0 auto" }} className="fade-in">
            <div style={{ marginBottom: "30px" }}>
                <h1 style={{ fontSize: "32px", color: "var(--primary-dark)", marginBottom: "6px" }}>📊 Admin Dashboard</h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "14.5px" }}>Real-time business analytics and catalog details</p>
            </div>

            {loading ? (
                <p style={{ color: "var(--text-secondary)" }}>Loading metrics...</p>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "25px" }}>
                    
                    {/* Products Card */}
                    <div style={{ 
                        background: "#fff", 
                        padding: "30px", 
                        borderRadius: "16px", 
                        textAlign: "center", 
                        boxShadow: "var(--shadow-sm)",
                        border: "1px solid var(--border-color)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "10px"
                    }}>
                        <div style={{ fontSize: "40px" }}>🛍️</div>
                        <h3 style={{ color: "var(--text-secondary)", fontSize: "16px", fontWeight: "600" }}>Total Products</h3>
                        <h2 style={{ color: "var(--primary)", fontSize: "36px", fontWeight: "800" }}>{products.length}</h2>
                    </div>

                    {/* Orders Card */}
                    <div style={{ 
                        background: "#fff", 
                        padding: "30px", 
                        borderRadius: "16px", 
                        textAlign: "center", 
                        boxShadow: "var(--shadow-sm)",
                        border: "1px solid var(--border-color)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "10px"
                    }}>
                        <div style={{ fontSize: "40px" }}>📦</div>
                        <h3 style={{ color: "var(--text-secondary)", fontSize: "16px", fontWeight: "600" }}>Total Orders</h3>
                        <h2 style={{ color: "var(--primary)", fontSize: "36px", fontWeight: "800" }}>{orders.length}</h2>
                    </div>

                    {/* Revenue Card */}
                    <div style={{ 
                        background: "#fff", 
                        padding: "30px", 
                        borderRadius: "16px", 
                        textAlign: "center", 
                        boxShadow: "var(--shadow-sm)",
                        border: "1px solid var(--border-color)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "10px"
                    }}>
                        <div style={{ fontSize: "40px" }}>💰</div>
                        <h3 style={{ color: "var(--text-secondary)", fontSize: "16px", fontWeight: "600" }}>Total Revenue</h3>
                        <h2 style={{ color: "var(--primary)", fontSize: "36px", fontWeight: "800" }}>₹{revenue.toLocaleString("en-IN")}</h2>
                    </div>

                </div>
            )}
        </div>
    );
}

export default AdminDashboard;