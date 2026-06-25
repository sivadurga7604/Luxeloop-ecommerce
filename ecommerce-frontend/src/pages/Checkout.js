import React, { useEffect, useState } from "react";

const API = "https://luxeloop-backend.onrender.com";

function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const [paying, setPaying] = useState(false);
    const userId = Number(localStorage.getItem("userId"));

    useEffect(() => {
        if (!userId) return;
        fetch(`${API}/cart/${userId}`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCartItems(data);
                else if (data.items) setCartItems(data.items);
                else setCartItems([]);
            })
            .catch(() => setCartItems([]));
    }, [userId]);

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const placeOrder = () => {
        if (cartItems.length === 0) { alert("Your cart is empty!"); return; }
        setPaying(true);
        fetch(`${API}/order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId, totalAmount: total,
                paymentId: "MOCK-" + Date.now(), status: "SUCCESS"
            })
        })
            .then(res => { if (!res.ok) throw new Error("Order failed"); return res.json(); })
            .then(() => fetch(`${API}/cart/clear/${userId}`, { method: "DELETE" }))
            .then(() => { setPaying(false); window.location.href = "/success"; })
            .catch(err => { setPaying(false); alert("Error: " + err.message); });
    };

    return (
        <div style={{ padding: "30px", maxWidth: "600px", margin: "0 auto" }}>
            <h1>Checkout</h1>
            {cartItems.length === 0 && <p>Your cart is empty.</p>}
            {cartItems.map(item => (
                <div key={item.id} style={{
                    display: "flex", justifyContent: "space-between",
                    background: "#fff", padding: "12px", marginBottom: "10px",
                    borderRadius: "8px", border: "1px solid #ddd"
                }}>
                    <span>{item.productName}</span>
                    <span>₹{item.price} x {item.quantity}</span>
                    <strong>₹{item.price * item.quantity}</strong>
                </div>
            ))}
            {cartItems.length > 0 && (
                <>
                    <div style={{ background: "#fff", padding: "15px", borderRadius: "8px", marginTop: "10px", display: "flex", justifyContent: "space-between" }}>
                        <h2>Total</h2><h2>₹{total}</h2>
                    </div>
                    <button onClick={placeOrder} disabled={paying} style={{
                        width: "100%", padding: "15px", marginTop: "20px",
                        background: paying ? "#aaa" : "#c2185b", color: "white",
                        border: "none", borderRadius: "10px", fontSize: "18px", cursor: "pointer"
                    }}>
                        {paying ? "Placing Order..." : "Place Order ₹" + total}
                    </button>
                </>
            )}
        </div>
    );
}

export default Checkout;