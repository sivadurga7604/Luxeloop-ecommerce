import React, { useEffect, useState } from "react";

        const API = "https://luxeloop-backend.onrender.com";

function Wishlist() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
    if (!userId) { setLoading(false); return; }
    loadWishlist();
    }, []);

    const loadWishlist = () => {
            setLoading(true);
    fetch(`${API}/wishlist/${userId}`)
            .then(res => res.json())
            .then(data => {
                    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
            })
            .catch(() => { setItems([]); setLoading(false); });
    };

    const remove = (productId) => {
            // FIX: optimistically remove from UI first, then call API
            setItems(prev => prev.filter(i => i.productId !== productId));
    fetch(`${API}/wishlist/${userId}/${productId}`, { method: "DELETE" })
            .catch(() => loadWishlist()); // revert if fails
    };

    const moveToCart = (item) => {
            fetch(`${API}/cart/add`, {
        method: "POST",
                headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
                userId: Number(userId),
                productId: item.productId,
                productName: item.productName,
                price: item.price,
                imageUrl: item.imageUrl,
                quantity: 1
            })
    }).then(res => {
    if (res.ok) {
        remove(item.productId);
        alert(item.productName + " moved to cart!");
    }
        });
    };

    if (!userId) return (
            <div style={{ padding: "30px" }}>
            <h1>Wishlist</h1>
            <p>Please <a href="/login">login</a> to view your wishlist.</p>
            </div>
    );

    if (loading) return <div style={{ padding: "30px" }}>Loading wishlist...</div>;

    return (
            <div style={{ padding: "30px" }}>
            <h1>❤️ My Wishlist</h1>
            {items.length === 0 && <p>Your wishlist is empty.</p>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
    {items.map(item => (
            <div key={item.id} style={{
            background: "#fff", borderRadius: "10px", padding: "15px",
            textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}>
                        <img
            src={item.imageUrl}
        alt={item.productName}
        width="150" height="150"
        style={{ objectFit: "cover", borderRadius: "8px" }}
        onError={e => { e.target.src = "https://placehold.co/150x150?text=No+Image"; }}
                        />
                        <h3>{item.productName}</h3>
            <p style={{ fontWeight: "bold", color: "#c2185b" }}>₹{item.price}</p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            <button onClick={() => moveToCart(item)} style={{
            background: "#667eea", color: "white", border: "none",
            padding: "8px 16px", borderRadius: "6px", cursor: "pointer"
                            }}>Move to Cart</button>
            <button onClick={() => remove(item.productId)} style={{
            background: "#ff4757", color: "white", border: "none",
            padding: "8px 16px", borderRadius: "6px", cursor: "pointer"
                            }}>Remove</button>
            </div>
            </div>
                ))}
            </div>
            </div>
    );
}

export default Wishlist;