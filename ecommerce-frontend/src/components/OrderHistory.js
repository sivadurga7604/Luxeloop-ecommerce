import React, { useEffect, useState } from "react";
import { API } from "../config";

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) { 
            setError("Please login to view order history."); 
            setLoading(false); 
            return; 
        }
        fetch(`${API}/order/${userId}`)
            .then(res => res.json())
            .then(data => {
                setOrders(Array.isArray(data) ? data : data.content || []);
                setLoading(false);
            })
            .catch(() => { 
                setError("Failed to load orders."); 
                setLoading(false); 
            });
    }, []);

    const formatDate = (d) => {
        if (!d) return "N/A";
        const date = new Date(d);
        if (date.getFullYear() === 1970) return "N/A";
        return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    };

    if (loading) return <div style={{ padding: "40px 5%", color: "var(--text-secondary)" }}>Reviewing purchase history...</div>;

    return (
        <div style={{ padding: "40px 5%", maxWidth: "800px", margin: "0 auto" }} className="fade-in">
            <h1 style={{ fontSize: "30px", color: "var(--primary-dark)", marginBottom: "25px" }}>My Orders</h1>

            {error ? (
                <div style={{ padding: "40px", background: "white", borderRadius: "16px", border: "1px solid var(--border-color)", textAlign: "center" }}>
                    <p style={{ color: "#c62828", marginBottom: "20px", fontWeight: "500" }}>{error}</p>
                    <a href="/login" style={{
                        display: "inline-block", padding: "12px 30px", background: "var(--primary)", color: "white",
                        borderRadius: "8px", fontWeight: "600"
                    }}>Login Here</a>
                </div>
            ) : orders.length === 0 ? (
                <div style={{
                    padding: "60px 20px", background: "#fff", borderRadius: "16px",
                    border: "1px dashed var(--border-color)", textAlign: "center"
                }}>
                    <p style={{ color: "var(--text-secondary)", fontSize: "16px", marginBottom: "20px" }}>You have placed no orders yet.</p>
                    <a href="/" style={{
                        display: "inline-block", padding: "12px 30px", background: "var(--primary)", color: "white",
                        borderRadius: "8px", fontWeight: "600"
                    }}>Browse Boutique catalog</a>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {orders.map(o => (
                        <div key={o.id} style={{
                            background: "#fff", 
                            padding: "24px", 
                            borderRadius: "16px", 
                            border: "1px solid var(--border-color)", 
                            boxShadow: "var(--shadow-sm)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1.5px solid #faf5f7", paddingBottom: "12px" }}>
                                <span style={{ fontSize: "15px", color: "var(--text-secondary)" }}>
                                    Order ID: <strong style={{ color: "var(--primary-dark)" }}>#{o.id}</strong>
                                </span>
                                <span style={{ 
                                    background: o.status === "SUCCESS" || o.status === "PLACED" ? "#e8f5e9" : "#e3f2fd",
                                    color: o.status === "SUCCESS" || o.status === "PLACED" ? "#2e7d32" : "#1565c0",
                                    padding: "4px 12px",
                                    borderRadius: "12px",
                                    fontSize: "12px",
                                    fontWeight: "700"
                                }}>
                                    {o.status}
                                </span>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                                <div>
                                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Date Placed</p>
                                    <p style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-primary)" }}>{formatDate(o.orderDate)}</p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "4px" }}>Total Amount</p>
                                    <p style={{ fontSize: "18px", fontWeight: "800", color: "var(--primary-light)" }}>₹{o.totalAmount.toLocaleString("en-IN")}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrderHistory;