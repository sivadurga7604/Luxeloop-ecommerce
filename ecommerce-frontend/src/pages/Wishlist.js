import React, { useEffect, useState } from "react";

const API = "https://luxeloop-backend.onrender.com";

function Wishlist() {
    const [items, setItems] = useState([]);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) return;
        loadWishlist();
    }, []);

    const loadWishlist = () => {
        fetch(`${API}/wishlist/${userId}`)
            .then(res => res.json())
            .then(data => setItems(Array.isArray(data) ? data : []));
    };

    const remove = (productId) => {
        fetch(`${API}/wishlist/${userId}/${productId}`, { method: "DELETE" })
            .then(loadWishlist);
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
        }).then(() => {
            remove(item.productId);
            alert(item.productName + " moved to cart!");
        });
    };

    if (!userId) return (
        <div style={{ padding: "30px" }}>
            <h1>Wishlist</h1>
            <p>Please login to view your wishlist.</p>
        </div>
    );

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
                        <img src={item.imageUrl} alt={item.productName} width="150" height="150"
                             style={{ objectFit: "cover", borderRadius: "8px" }}
                             onError={e => { e.target.src = "https://via.placehold.com/150x150?text=No+Image"; }} />
                        <h3>{item.productName}</h3>
                        <p style={{ fontWeight: "bold" }}>₹{item.price}</p>
                        <button onClick={() => moveToCart(item)} style={{
                            background: "#667eea", color: "white", border: "none",
                            padding: "8px 16px", borderRadius: "6px", cursor: "pointer", marginRight: "8px"
                        }}>Move to Cart</button>
                        <button onClick={() => remove(item.productId)} style={{
                            background: "#ff4757", color: "white", border: "none",
                            padding: "8px 16px", borderRadius: "6px", cursor: "pointer"
                        }}>Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Wishlist;