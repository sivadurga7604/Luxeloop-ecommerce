import React, { useEffect, useState } from "react";

const API = "https://luxeloop-backend.onrender.com";

function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) { setError("Please login first."); setLoading(false); return; }
        fetch(`${API}/order/${userId}`)
            .then(res => res.json())
            .then(data => {
                setOrders(Array.isArray(data) ? data : data.content || []);
                setLoading(false);
            })
            .catch(() => { setError("Failed to load orders."); setLoading(false); });
    }, []);

    const formatDate = (d) => {
        if (!d) return "N/A";
        const date = new Date(d);
        if (date.getFullYear() === 1970) return "N/A";
        return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    };

    if (loading) return <div style={{ padding: "30px" }}>Loading orders...</div>;
    if (error) return <div style={{ padding: "30px" }}><h1>My Orders</h1><p style={{ color: "red" }}>{error}</p></div>;

    return (
        <div style={{ padding: "30px" }}>
            <h1>My Orders</h1>
            {orders.length === 0 && <p>No orders found.</p>}
            {orders.map(o => (
                <div key={o.id} style={{
                    background: "#fff", padding: "20px", marginBottom: "15px",
                    borderRadius: "10px", border: "1px solid #ddd", boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
                }}>
                    <p><strong>Order ID:</strong> #{o.id}</p>
                    <p><strong>Amount:</strong> ₹{o.totalAmount}</p>
                    <p><strong>Status:</strong> <span style={{ color: o.status === "SUCCESS" ? "#28a745" : "#007bff", fontWeight: "bold" }}>{o.status}</span></p>
                    <p><strong>Date:</strong> {formatDate(o.orderDate)}</p>
                </div>
            ))}
        </div>
    );
}

export default OrderHistory;