import React, { useEffect, useState } from "react";

const API = "https://luxeloop-backend.onrender.com";

function AdminDashboard() {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch(`${API}/products`).then(res => res.json()).then(data => setProducts(data));
        fetch(`${API}/order`).then(res => res.json()).then(data => setOrders(Array.isArray(data) ? data : []));
    }, []);

    const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    return (
        <div style={{ padding: "30px" }}>
            <h1>📊 Admin Dashboard</h1>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", minWidth: "150px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    <h2>🛍</h2><h3>Products</h3><h2>{products.length}</h2>
                </div>
                <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", minWidth: "150px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    <h2>📦</h2><h3>Orders</h3><h2>{orders.length}</h2>
                </div>
                <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", minWidth: "150px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    <h2>💰</h2><h3>Revenue</h3><h2>₹{revenue}</h2>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;