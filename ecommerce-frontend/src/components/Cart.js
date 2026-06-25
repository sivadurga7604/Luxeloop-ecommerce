import React, { useEffect, useState } from "react";

const API = "https://luxeloop-backend.onrender.com";

function Cart() {
    const [cart, setCart] = useState([]);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) return;
        fetch(`${API}/cart/${userId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCart(data);
                else if (data.items) setCart(data.items);
                else setCart([]);
            })
            .catch(() => setCart([]));
    }, [userId]);

    const remove = (id) => {
        fetch(`${API}/cart/${id}`, { method: "DELETE" })
            .then(() => window.location.reload());
    };

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <div style={{ padding: "30px" }}>
            <h1>Cart</h1>
            {cart.length === 0 && <p>Your cart is empty.</p>}
            {cart.map(i => (
                <div key={i.id} style={{
                    display: "flex", alignItems: "center", gap: "15px",
                    background: "#fff", padding: "10px", marginBottom: "10px",
                    borderRadius: "8px", border: "1px solid #ddd"
                }}>
                    <img src={i.imageUrl} width="80" alt={i.productName}
                         onError={e => { e.target.src = "https://via.placehold.com/80x80?text=No+Image"; }} />
                    <div>
                        <h3>{i.productName}</h3>
                        <p>₹{i.price} x {i.quantity}</p>
                    </div>
                    <button onClick={() => remove(i.id)} style={{
                        marginLeft: "auto", background: "#ff4444", color: "white",
                        border: "none", padding: "8px 14px", borderRadius: "6px", cursor: "pointer"
                    }}>Remove</button>
                </div>
            ))}
            <h2>Total: ₹{total}</h2>
        </div>
    );
}

export default Cart;